import React from "react";

const PageTransitionLoading: React.FC = () => {
  return (
    <div style={styles.wrapper}>
      <div style={styles.boxWrap}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} style={{ ...styles.box, ...styles[`box${i + 1}`] }}></div>
        ))}
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  wrapper: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 9999,
  },
  boxWrap: {
    display: "flex",
    gap: "10px",
  },
  box: {
    width: "20px",
    height: "20px",
    backgroundColor: "#000",
    animation: "box-animation 1.2s infinite",
  },
};

export default PageTransitionLoading;
