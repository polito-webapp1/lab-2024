import React from "react";

const FeedbackContext = React.createContext({
    setFeedback: (message) => {},
    setFeedbackFromError: (error) => {},
    setShouldRefresh: (value) => {}
});

export default FeedbackContext;