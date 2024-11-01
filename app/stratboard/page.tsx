import Canvas from "../ui/stratboard/canvas";
import TopNav from "../ui/stratboard/topnav";
import SideMenu from "../ui/stratboard/sidemenu";
import BottomBar from "../ui/stratboard/bottombar";
export default function StratBoard () {
    return (
        <div className="flex flex-col h-screen">
            <div className="border-b px-60 py-4"><TopNav /></div>
            <div className="flex w-full h-5/6 flex-row border-b">
                <div className="border-r px-3 w-1/6"><SideMenu /></div>
                <div className="border-r w-3/4 overflow-hidden"><Canvas /></div>
                <div className="w-1/6"></div>
            </div>
            <div className=""><BottomBar /></div>
        </div>
    );
}