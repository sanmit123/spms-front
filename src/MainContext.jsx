import { createContext, useState } from "react";

const MyContext = createContext();

// eslint-disable-next-line react/prop-types
const MyContextProvider = ({ children, userData }) => {
  const [user, setUser] = useState(userData);

  const contextValue = {
    user,
    setUser,
  };

  return (
    <MyContext.Provider value={contextValue}>
      {children}
    </MyContext.Provider>
  );
};

export { MyContext, MyContextProvider };
