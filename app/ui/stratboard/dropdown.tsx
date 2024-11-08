import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
  } from "@nextui-org/dropdown";
  import { useAppStore } from "@/app/providers/app-store-provider";
import { Key } from "react";
import { svgPaths } from "@/app/library/data";

export default function MapMenu() {
    const {map, changeMap} = useAppStore(store=>store)
    const itemList = svgPaths.map((value) => <DropdownItem key={value}>{value}</DropdownItem>)
    function updateMap(key:Key):void{
        const newMap = key as string;
        if (key!=map) {
            changeMap(newMap)
        }
    }
    return(
        <Dropdown>
            <DropdownTrigger>
                <button>
                    {map}
                </button>
            </DropdownTrigger>
            <DropdownMenu
                onAction={(key)=>updateMap(key)}
            >
                {itemList}
            </DropdownMenu>
        </Dropdown>
    )
}