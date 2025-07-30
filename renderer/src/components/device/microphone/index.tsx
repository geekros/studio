// Copyright 2024 GEEKROS, Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { Button } from "@/components/base/button";
import { Loading } from "@/components/base/loading";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/base/select";
import { useLibs } from "@/libs";
import { MicIcon, MicOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeviceMicrophoneVisualizer } from "./visualizer";
import { useLanguage } from "@/hooks/context/language";

type DeviceMicrophoneProps = {
    className?: string;
};

interface state {
    error: string;
    stream: MediaStream;
    audios: InputDeviceInfo[];
    active_audio: InputDeviceInfo;
    active_audio_track: MediaStreamTrack;
    enabled: boolean;
    loading: boolean;
}

const default_state: state = {
    error: "",
    stream: new MediaStream(),
    audios: [],
    active_audio: {} as InputDeviceInfo,
    active_audio_track: {} as MediaStreamTrack,
    enabled: true,
    loading: true,
};

export function DeviceMicrophone({ className }: DeviceMicrophoneProps) {
    const { lang } = useLanguage();

    const device = useLibs.device.MediaDevice;

    const [microphone, setMicrophone] = useState<state>(default_state);

    const update = (value: state) => {
        setMicrophone((prev: any) => ({ ...prev, ...value }));
    };

    function onDeviceDisable() {
        if (microphone.active_audio_track) {
            microphone.enabled = !microphone.enabled;
            microphone.active_audio_track.enabled = !microphone.enabled;
            update(microphone);
        }
    }

    useEffect(() => {
        device.GetAudio(
            (stream: MediaStream, audios: InputDeviceInfo[], active_audio: InputDeviceInfo, active_audio_track: MediaStreamTrack) => {
                setTimeout(() => {
                    const audio: any = document.getElementById("audio_stream");
                    audio.srcObject = stream;
                    audio.onloadedmetadata = function (_e: any) {
                        audio.play();
                    };
                }, 500);
                microphone.stream = stream;
                microphone.audios = audios;
                microphone.active_audio = active_audio;
                microphone.active_audio_track = active_audio_track;
                microphone.enabled = !active_audio_track.enabled;
                microphone.loading = false;
                update(microphone);
            },
            (error: any) => {
                microphone.error = error.message;
                microphone.loading = false;
                update(microphone);
            }
        );
    }, []);

    return (
        <div className={"w-full space-y-2 " + className}>
            <div className="w-full">
                <span className="flex flex-row gap-2">
                    <Button className="rounded-md border border-border/80" variant="secondary" disabled={device.audios.length === 0} onClick={onDeviceDisable}>
                        {microphone.enabled ? <MicOffIcon className="w-4 h-4" /> : <MicIcon className="w-4 h-4" />}
                    </Button>
                    <Select disabled={microphone.audios.length === 0 || microphone.enabled} value={microphone.active_audio?.deviceId || ""} defaultValue={microphone.active_audio?.deviceId || ""}>
                        <SelectTrigger className="placeholder-item h-8 w-full border-border focus:ring-0">
                            <span className="w-full mr-2 text-xs line-clamp-1">
                                <SelectValue placeholder={lang("common.choose_microphone")} />
                            </span>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="border-border">
                            {microphone.audios.map((item: any) => {
                                return (
                                    <SelectItem className="text-xs" key={item.deviceId} value={item.deviceId}>
                                        {item.label}
                                    </SelectItem>
                                );
                            })}
                        </SelectContent>
                    </Select>
                </span>
            </div>
            <div className="text-xs leading-normal">
                <div className="relative">
                    {microphone.error !== "" ? (
                        <div className="w-full flex h-[100px] md:h-[207px] items-center justify-center border border-border rounded-md uppercase">{microphone.error}</div>
                    ) : (
                        <div className="w-full flex h-[100px] md:h-[207px] items-center justify-center border border-border rounded-md">
                            {microphone.active_audio_track && !microphone.loading ? (
                                <div className="w-full h-full">{microphone.stream ? <DeviceMicrophoneVisualizer stream={microphone.stream} bands={12} /> : null}</div>
                            ) : (
                                <Loading />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
