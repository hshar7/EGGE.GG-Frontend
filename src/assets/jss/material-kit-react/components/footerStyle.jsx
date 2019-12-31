import { container, primaryColor } from "assets/jss/material-kit-react.jsx";

const footerStyle = {
  block: {
    color: "inherit",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    textDecoration: "none",
    marginBottom: "0.5rem"
  },
  footer: {
    color: "white",
    background: "linear-gradient(90deg, rgba(240,83,0,1) 0%, rgba(255,121,50,1) 35%, rgba(240,83,0,1) 100%)",
    marginTop: "10rem",
    paddingTop: "5rem",
    paddingBottom: "5rem",
    textAlign: "center",
    zIndex: "2"
  },
  a: {
    color: primaryColor,
    textDecoration: "none",
    backgroundColor: "transparent"
  },
  footerWhiteFont: {
    "&,&:hover,&:focus": {
      color: "#FFFFFF"
    }
  },
  container,
  links: {
    marginTop: "0",
    textAlign: "center"
  },
  inlineBlock: {
    padding: "0px"
  },
  icon: {
    width: "18px",
    height: "18px",
    position: "relative",
    top: "3px"
  }
};
export default footerStyle;
