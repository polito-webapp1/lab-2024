import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: (message) => {},
    setFeedbackFromError: (error) => {}
});

export default FeedbackContext;