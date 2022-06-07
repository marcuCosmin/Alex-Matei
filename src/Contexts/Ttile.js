import React, {useEffect, useState} from 'react';

const userTiitle = React.createContext({value: 'CEO', update: null});

function Title({children}) {

    const [title, setTitle] = useState({
        value: 'CEO',
        update: function(e) {setTitle({...title, value: e}) }
    });

    return (

        <userTiitle.Provider value={title}>
            {children}
        </userTiitle.Provider>
    );
}

export {userTiitle, Title};