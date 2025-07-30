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
import { VideoIcon, VideoOffIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { DeviceCameraVisualizer } from "./visualizer";
import { useLanguage } from "@/hooks/context/language";

type DeviceCameraProps = {
    className?: string;
};

interface state {
    error: string;
    stream: MediaStream;
    videos: InputDeviceInfo[];
    active_video: InputDeviceInfo;
    active_video_track: MediaStreamTrack;
    enabled: boolean;
    loading: boolean;
}

const default_state: state = {
    error: "",
    stream: new MediaStream(),
    videos: [],
    active_video: {} as InputDeviceInfo,
    active_video_track: {} as MediaStreamTrack,
    enabled: true,
    loading: true,
};

export function DeviceCamera({ className }: DeviceCameraProps) {
    const { lang } = useLanguage();

    const device = useLibs.device.MediaDevice;

    const [camera, setCamera] = useState<state>(default_state);

    const update = (value: state) => {
        setCamera((prev: any) => ({ ...prev, ...value }));
    };

    function onDeviceDisable() {
        if (camera.active_video_track) {
            camera.enabled = !camera.enabled;
            camera.active_video_track.enabled = !camera.enabled;
            update(camera);
        }
    }

    useEffect(() => {
        device.GetVideo(
            (stream: MediaStream, videos: InputDeviceInfo[], active_video: InputDeviceInfo, active_video_track: MediaStreamTrack) => {
                setTimeout(() => {
                    const video: any = document.getElementById("video_stream");
                    video.srcObject = stream;
                    video.onloadedmetadata = function (_e: any) {
                        video.play();
                    };
                }, 500);
                camera.stream = stream;
                camera.videos = videos;
                camera.active_video = active_video;
                camera.active_video_track = active_video_track;
                camera.enabled = !active_video_track.enabled;
                camera.loading = false;
                update(camera);
            },
            (error: any) => {
                camera.error = error.message;
                update(camera);
            }
        );
    }, []);

    return (
        <div className={"w-full space-y-2 " + className}>
            <div className="w-full">
                <span className="flex flex-row gap-2">
                    <Button className="rounded-md border border-border/80" variant="secondary" disabled={device.videos.length === 0} onClick={onDeviceDisable}>
                        {camera.enabled ? <VideoOffIcon className="w-4 h-4" /> : <VideoIcon className="w-4 h-4" />}
                    </Button>
                    <Select disabled={camera.videos.length === 0 || camera.enabled} value={camera.active_video?.deviceId || ""} defaultValue={camera.active_video?.deviceId || ""}>
                        <SelectTrigger className="placeholder-item h-8 w-full border-border focus:ring-0">
                            <span className="w-full mr-2 text-xs line-clamp-1">
                                <SelectValue placeholder={lang("common.choose_camera")} />
                            </span>
                        </SelectTrigger>
                        <SelectContent side="bottom" className="border-border">
                            {camera.videos.map((item: any) => {
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
                    {camera.error !== "" ? (
                        <div className="w-full flex h-[179px] md:h-[207px] items-center justify-center border border-border rounded-md uppercase">{camera.error}</div>
                    ) : (
                        <div className="w-full flex h-[179px] md:h-[207px] items-center justify-center border border-border rounded-md">
                            {camera.active_video_track && !camera.loading ? (
                                <div className="w-full h-full">
                                    <DeviceCameraVisualizer />
                                </div>
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
