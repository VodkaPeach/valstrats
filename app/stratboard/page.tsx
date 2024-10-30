import Canvas from "../ui/stratboard/canvas";
import TopNav from "../ui/stratboard/topnav";
import SideMenu from "../ui/stratboard/sidemenu";
import BottomBar from "../ui/stratboard/bottombar";
export default function StratBoard () {
    return (
        <div className="flex flex-col">
            <div className="border-b px-60"><TopNav /></div>
            <div className="flex w-full flex-row border-b">
                <div className="border-r px-3"><SideMenu /></div>
                <div className="border-r"><Canvas /></div>
                <div></div>
            </div>
            <div><BottomBar /></div>
        </div>
    );
}