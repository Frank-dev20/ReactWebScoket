import { useState, useEffect } from 'react';
import { createRoot } from 'react-dom';
import { w3cwebsocket } from 'websocket';
import { Card, Avatar, Input, Typography } from 'antd';

const { Search } = Input;
const { Text } = Typography;
const { Meta } = Card;

const client = new w3cwebsocket('ws://localhost:9000');

const App = () => {
  const [userName, setUserName] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [messages, setMessages] = useState([]);
  const [searchVal, setSearchVal] = useState('');

  const onButtonClicked = (value) => {
    client.send(JSON.stringify({
      type: "message",
      msg: value,
      user: userName
    }));
    setSearchVal('');
  }

  useEffect(() => {
    client.onopen = () => {
      console.log("Connected successfully");
    };

    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      if (data.type === "message") {
        setMessages((prevMessages) => [...prevMessages, { msg: data.msg, user: data.user }]);
      }
    };
  }, []);

  return (
    <div className="main" id='wrapper'>
      {isLoggedIn ? (
        <div>
          <div className="title">
            <Text id="main-heading" type="secondary" style={{ fontSize: '36px' }}>
              {userName}
            </Text>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', paddingBottom: 50 }} id="messages">
            {messages.map((message) => (
              <Card
                key={message.msg}
                style={{
                  width: 300,
                  margin: '16px 4px 0 4px',
                  alignSelf: userName === message.user ? 'flex-end' : 'flex-start'
                }}
                loading={false}
              >
                <Meta
                  avatar={
                    <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                      {message.user[0].toUpperCase()}
                    </Avatar>
                  }
                  title={`${message.user}:`}
                  description={message.msg}
                />
              </Card>
            ))}
          </div>
          <div className="bottom">
            <Search
              placeholder="type message"
              enterButton="Send"
              value={searchVal}
              size="large"
              onChange={(e) => setSearchVal(e.target.value)}
              onSearch={onButtonClicked}
            />
          </div>
        </div>
      ) : (
        <div style={{ padding: '200px 40px' }}>
          <Search
            placeholder="Enter Username"
            enterButton="Login"
            size="large"
            onSearch={(value) => {
              setIsLoggedIn(true);
              setUserName(value);
            }}
          />
        </div>
      )}
    </div>
  );
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);
root.render(<App />);
