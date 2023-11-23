import { useEffect } from 'react';
import { Terminal } from 'xterm';

import 'xterm/css/xterm.css';
import Draggable from 'react-draggable';

const WebTerminal = () => {
    useEffect(() => {
        const terminal = new Terminal();

        terminal.open(document.getElementById('terminal') as HTMLElement);

        terminal.onData((e) => {
            terminal.write(e);
        });

        terminal.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');
    }, []);

    return (
        <Draggable>
            <div id="terminal" />
        </Draggable>
        
    );
};

export default WebTerminal;