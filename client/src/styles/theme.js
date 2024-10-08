//Extends Chakra UI theme to match application branding.
import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
    config: {
        initialColorMode: "dark",
        useSystemColorMode: false,
    },
    styles: {
        global: {
            "*": {
                boxSizing: "border-box",
                margin: 0,
                padding: 0,
                fontFamily: `"Roboto", "Sans-sarif", "Times New Roman"`,
            },
            "html, body": {
                backgroundColor: "#0f1121",
                maxHeight: "100vh",
                height: "100vh",
                overflowY: "hidden",
            },
        },
    },
    colors: {
        primary: "#0f1121",
        secondary: "#1b1f3d",
        hover: "#474d7a",
        inputLabel: "#e1e3f0",
    },
    components: {
        Button: {
            baseStyle: {
                fontWeight: "500",
            }
        },
        FormLabel: {
            baseStyle: {
                fontWeight: "bold",
                fontSize: "sm",
                color: "inputLabel",
            },
        },
        Input: {
            defaultProps: {
                size: "md",
            },
        },
        Select: {
            defaultProps: {
                size: "md",
            },
        },
        Textarea: {
            defaultProps: {
                size: "md",
            },
        },
        InputGroup: {
            defaultProps: {
                size: "md",
            },
        },
        Modal: {
            sizes: {
                lg: {
                    dialog: {
                        maxWidth: "70%",
                        maxHeight: "85%",
                        minHeight: "85%",
                        backgroundColor: "#0f1121",
                    },
                    body: {
                        overflowY: "auto",
                    },
                },
                md: {
                    dialog: {
                        minWidth: "40%",
                        minHeight: "50%",
                        backgroundColor: "#0f1121",
                    },
                    body: {
                        overflowY: "auto",
                    },
                },
            },
        },
    },
});