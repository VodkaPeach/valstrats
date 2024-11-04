import {
    Dropdown,
    DropdownTrigger,
    DropdownMenu,
    DropdownItem
  } from "@nextui-org/dropdown";
  import { useAppStore } from "@/app/providers/app-store-provider";
import { Key } from "react";

export default function MapMenu() {
    const {map, changeMap} = useAppStore(store=>store)
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
                <DropdownItem key={"Abyss"}>Abyss</DropdownItem>
                <DropdownItem key={"Ascent"}>Ascent</DropdownItem>
                <DropdownItem key={"Bind"}>Bind</DropdownItem>
                <DropdownItem key={"Breeze"}>Breeze</DropdownItem>
                <DropdownItem key={"Fracture"}>Fracture</DropdownItem>
                <DropdownItem key={"Haven"}>Haven</DropdownItem>
                <DropdownItem key={"Icebox"}>Icebox</DropdownItem>
                <DropdownItem key={"Lotus"}>Lotus</DropdownItem>
                <DropdownItem key={"Pearl"}>Pearl</DropdownItem>
                <DropdownItem key={"Split"}>Split</DropdownItem>
                <DropdownItem key={"Sunset"}>Sunset</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    )
}