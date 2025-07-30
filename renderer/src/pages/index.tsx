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

import { Avatar, AvatarFallback, AvatarImage } from "@/components/base/avatar";
import { Button } from "@/components/base/button";
import { Input } from "@/components/base/input";
import { ArrowUpIcon, GaugeIcon, LogOutIcon, PocketKnifeIcon, Rotate3DIcon, SettingsIcon } from "lucide-react";

export function PageIndex() {
    return (
        <div className="w-full h-full max-w-[400px] lg-[300px]:hidden mx-auto">
            <div className="w-full h-[50px] p-[10px] pb-0">
                <div className="w-full flex items-center justify-center space-x-[5px]">
                    <div className="w-[40px] h-[40px]">
                        <Avatar className="w-[40px] h-[40px]">
                            <AvatarImage src="https://avatars.githubusercontent.com/u/156150246?v=4&size=64" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="w-full h-[40px] flex items-center justify-center">
                        <div className="w-full text-sm">MakerYang</div>
                        <div className="w-full text-xs text-muted-foreground">
                            <div className="w-full flex items-center justify-end">
                                <Button variant="ghost" className="rounded-full">
                                    <LogOutIcon className="w-3 h-3" />
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[80px] p-[10px]">
                <div className="w-full h-full flex items-center justify-center space-x-[10px]">
                    <div className="w-full h-[60px] rounded-md bg-primary/5">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-auto space-y-1">
                                <GaugeIcon className="w-4 h-4 mx-auto" />
                                <span className="text-xs">仪表盘</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[60px] rounded-md bg-primary/5">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-auto space-y-1">
                                <Rotate3DIcon className="w-4 h-4 mx-auto" />
                                <span className="text-xs">模拟仿真</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[60px] rounded-md bg-primary/5">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-auto space-y-1">
                                <PocketKnifeIcon className="w-4 h-4 mx-auto" />
                                <span className="text-xs">软件库</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full h-[60px] rounded-md bg-primary/5">
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-auto space-y-1">
                                <SettingsIcon className="w-4 h-4 mx-auto" />
                                <span className="text-xs">设置</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="w-full h-[calc(100%-186px)] px-[10px]">
                <div className="w-full h-full">
                    <div className="w-full">1</div>
                </div>
            </div>
            <div className="w-full h-[56px] relative p-[10px]">
                <Input className="w-full text-sm pr-10" />
                <Button className="absolute top-1/2 right-4 size-6 -translate-y-1/2 rounded-full">
                    <ArrowUpIcon className="size-3.5" />
                </Button>
            </div>
        </div>
    );
}
