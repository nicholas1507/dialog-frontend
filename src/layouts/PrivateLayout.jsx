import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';
import { useSidebar } from '../contexts/SidebarContext';

const SIDEBAR_WIDTH = 256; 

const PrivateLayout = () => {
    const { visible } = useSidebar();

    return (
        <div>
            <Sidebar />
            <div
                className="d-flex flex-column"
                style={{
                    minHeight: '100vh',
                    marginLeft: visible ? `${SIDEBAR_WIDTH}px` : '0',
                    transition: 'margin-left 0.3s',
                    background: '#f8f9fa'
                }}
            >
                <Navbar />
                <main className="flex-grow-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default PrivateLayout;