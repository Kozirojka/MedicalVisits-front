import * as signalR from "@microsoft/signalr"
import { useEffect, useState } from "react";


export default function ChatApp() {


    const [connection, setConnection] = useState(null);
    const [count, setCount] = useState(0);
    const [userCount, setUserCount] = useState(0);

    useEffect(() =>{

        
        
        // Це потрібно тут для того, щоб підключитист до сервера        
        const newConnection = new signalR.HubConnectionBuilder()
        .withUrl('http://localhost:5268/ChatHub') 
        .withAutomaticReconnect()  
        .build();  

        //функція яка потрібна для того, щоб при моєму підключенню на сервер слалось помиланн, що
        //потрібно використати метод NewWindowLoaded та інкрементувати на одни
        function newWindowLoadClient() {
            newConnection.invoke("NewWindowLoaded")
                .catch(error => console.error("Error invoking NewWindowLoaded:", error));
        }
        

        //може прийняти повідомлення від сервера
        newConnection.on("updateTotalViews", (value) => {
            setCount(value);
        });

        newConnection.on("updateTotalUsers", (value) => {
            setUserCount(value);
        });
        
        newConnection.start()
            .then(() => {
                console.log("Successfully connected to SignalR hub");
                setConnection(newConnection);
                newWindowLoadClient();
            })
            .catch(error => {
                console.error("SignalR Connection Error: ", error);
            });





        return () => {
            if (newConnection) {
                newConnection.stop()
                    .then(() => {
                        console.log("SignalR connection closed");
                    })
                    .catch(error => {
                        console.error("Error stopping connection: ", error);
                    });
            }
        };
    }, []);

    
    return (
        <div className="chat-container">
            <h1>Chat Room</h1>
            <div className="chat-status">
                {connection ? 
                    <span className="connected">Connected to chat</span> : 
                    <span className="connecting">Connecting...</span>
                }
            </div>
            {/* Chat interface will go here */}

            <div className='container'>
                <div className="row">
                    <p>Total view {count}</p>
                    <p>Total users {userCount}</p>
                </div>
            </div>
        </div>
    );
  }

