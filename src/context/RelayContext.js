import Script from "next/script";
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { lsTest, useLocalStorage } from "../utils/storage";
import axios from "axios";

// export interface RelaySignResult {
//   algorithm: 'bitcoin-signed-message';
//   key: 'identity';
//   data: string; // data you passed in
//   value: string; // signature
// }

// export interface RelayBroadcastResponse {
//   amount: number;
//   currency: string;
//   identity: string;
//   paymail: string; // sender paymail
//   rawTx: string;
//   satoshis: number;
//   txid: string;
// }

// interface RelayOneAlpha {
//   run: RelayOneRun;
//   dex: RelayOneDex;
// }

// interface RelayOneDex {
//   getDexKey: () => Promise<string>;
//   pay: (tx: string) => Promise<any>; // TODO: These can take bsv.Transaction as well
//   sign: (tx: string) => Promise<any>; // TODO: These can take bsv.Transaction as well
// }
// interface RelayOneRun {
//   getOwner: () => Promise<string>;
//   getLegacyOwner: () => Promise<string>;
// }

// interface RenderProps {
//   to: string;
//   amount: string;
//   currency: string;
//   editable?: boolean;
//   opReturn?: string | string[];
//   onPayment?: (response: RelayBroadcastResponse) => void;
// }
// interface RelayOne {
//   authBeta: () => Promise<string>;
//   send: (payload: any) => Promise<RelayBroadcastResponse>;
//   quote: (payload: any) => Promise<string>;
//   sign: (payload: string) => Promise<RelaySignResult>;
//   isApp: () => boolean;
//   render: (ele: HTMLDivElement, props: RenderProps) => void;
//   alpha: RelayOneAlpha;
// } // TODO: Complete

// // 'relay-container', { to: Current.campaign.funding_address }
// type RelayOtcOptions = {
//   to: string;
// };

// interface RelayOtc {
//   buy: (container: string, options: RelayOtcOptions) => void;
// } // TODO: Complete

// type ContextValue = {
//   relayOne: RelayOne | undefined;
//   relayOtc: RelayOtc | undefined;
//   paymail: string | undefined;
//   authenticate: () => Promise<void>;
//   authenticated: boolean;
//   ready: boolean;
//   isApp: boolean;
//   setPaymail: (paymail: string | undefined) => void;
//   runOwner: string | undefined;
// };

const RelayContext = React.createContext(undefined);

const RelayProvider = (props) => {
  const [relayPaymail, setRelayPaymail] = useLocalStorage(paymailStorageKey);
  const [relayToken, setRelayToken] = useLocalStorage(relayTokenStorageKey);
  const [relayOne, setRelayOne] = useState();
  const [relayOtc, setRelayOtc] = useState();
  const [runOwner, setRunOwner] = useLocalStorage(runOwnerStorageKey);
  const [geistNFTs, setGeistNFTs] = useState([]);
  const [mintedCollections, setMintedCollections] = useState([]);

  const [ready, setReady] = useState(false);

  const misprints = [
    "254cc23144c64cc9f4c249146ce7c52dc13a76a114fb8eb69347aa5e3e7689bf_o2",
    "5ab72c164de3514848a086e99975be1508124db704f273a616baa42cf820a1dc_o2",
    "28b6e0569c6093f8a65962a2d9d66220d610594a5bc39c2021ace64a4bcd3dfe_o2",
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      setRelayOne(window.relayone);
      setRelayOtc(window.relayotc);
      setReady(true);
    }
  }, []);

  const isApp = useMemo(
    () => (relayOne && relayOne.isApp()) || false,
    [relayOne]
  );

  const relayAuthenticate = useCallback(async () => {
    if (!relayOne) {
      console.info({ relayOne, w: window.relayone });
      throw new Error("Relay script not yet loaded!");
    }

    // Test localStorage is accessible
    if (!lsTest()) {
      throw new Error("localStorage is not available");
    }

    const token = await relayOne.authBeta();

    if (token && !token.error) {
      setRelayToken(token);
      const payloadBase64 = token.split(".")[0]; // Token structure: "payloadBase64.signature"
      const { paymail: returnedPaymail } = JSON.parse(atob(payloadBase64));
      setRelayPaymail(returnedPaymail);
      const owner = await relayOne?.alpha.run.getOwner();
      const userBalances = await axios.get(
        `https://staging-backend.relayx.com/api/user/balance2/${owner}`
      );

      // Get the number of Geist mints
      const userProfile = await axios.get(
        `https://staging-backend.relayx.com/api/profile/geist@relayx.io`
      );

      const totalMints = userProfile.data.data.minted;

      const pages = Math.ceil(totalMints / 10);

      const filteredGeistCollections = [];

      //Cycle through the pages and get the data
      for (let index = 1; index <= pages; index++) {
        const { data } = await axios.get(
          `https://staging-backend.relayx.com/api/mint/list?page=${index}&paymail=geist@relayx.io`
        );
        // Filter out the misprints
        const filteredMints = data.data.mints.filter(
          (mint) => !misprints.includes(mint.location)
        );
        console.log("mintedCollections", mintedCollections);
        filteredGeistCollections.push(...filteredMints);
        // console.log("mintedCollections", mintedCollections);
      }
      // Get GEIST Collections ✅
      console.log("filteredGeistCollections", filteredGeistCollections);

      // Go through the filtered Geist Collections and check if they are in the user's balance
      const userGeistCollections = filteredGeistCollections.filter((mint) =>
        userBalances.data.data.collectibles.some(
          (collectible) => collectible.origin === mint.origin
        )
      );

      console.log("User Balances: ", userBalances.data.data.collectibles);
      console.log("userGeistCollections", userGeistCollections);

      setGeistNFTs(userGeistCollections);

      setRunOwner(owner);
    } else {
      throw new Error(
        "If you are in private browsing mode try again in a normal browser window. (Relay requires localStorage)"
      );
    }
  }, [relayOne, setRelayPaymail, setRunOwner]);

  const relaySend = useCallback(
    async (outputs) => {
      try {
        console.log("relay.send.outputs", outputs);
        let result = await relayOne.send(outputs);
        return result;
      } catch (error) {
        console.log("relayx.send.error", outputs, error);
        throw new Error(error);
      }
    },
    [relayOne]
  );

  // Auto Authenticate when inside the Relay app
  useEffect(() => {
    if (isApp) {
      relayAuthenticate();
    }
  }, [relayAuthenticate, isApp]);

  const relayLogout = () => {
    setRelayPaymail("");
    setRunOwner("");
    localStorage.removeItem(paymailStorageKey);
    localStorage.removeItem(runOwnerStorageKey);
  };

  const value = useMemo(
    () => ({
      relayOne,
      relayOtc,
      setRelayPaymail,
      relayPaymail,
      relayAuthenticate,
      authenticated: !!relayPaymail,
      relaySend,
      relayLogout,
      ready,
      isApp,
      runOwner,
      geistNFTs,
      relayToken,
    }),
    [
      relayOne,
      relayOtc,
      setRelayPaymail,
      relayPaymail,
      relayAuthenticate,
      relaySend,
      relayLogout,
      ready,
      isApp,
      geistNFTs,
      runOwner,
      relayToken,
    ]
  );

  return <RelayContext.Provider value={value} {...props} />;
};

const useRelay = () => {
  const context = useContext(RelayContext);
  if (context === undefined) {
    throw new Error("useRelay must be used within a RelayProvider");
  }
  return context;
};

export { RelayProvider, useRelay };

//
// Utils
//

const paymailStorageKey = "askbitcoin__RelayProvider_paymail";
const relayTokenStorageKey = "peafowl_excellence_RelayProvider_authToken";
const runOwnerStorageKey = "askbitcoin__RelayProvider_runOwner";
