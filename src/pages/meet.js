import React, { useEffect, useState } from "react";
import VideoDashboard from "../components/VideoDashboard";
import { useAPI } from "../hooks/useAPI";
import { useTuning } from "../context/TuningContext";
import { useRouter } from 'next/router'
import Collectibles from './collectibles'
import { useAuth } from "src/hooks/useAuth";
import { useTokenMeetLiveWebsocket } from "src/hooks/useWebsocket";

import root from 'window-or-global'

import { Socket } from 'socket.io-client'
import { sendMessage } from "src/utils/bsocial/message";
import axios from "axios";


const Index = () => {

    return (
        <VideoDashboard

        />

    );
};

export default Index;
