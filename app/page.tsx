"use client";

import { useState } from "react";

const videos = [
  "https://mega.nz/embed/bIk3iBbS#lFCtT2qjl7PxOPlMnJA5OHEo7WCk7HITWlL7GWUQtS0",
  "https://mega.nz/embed/jA1VELyY#YmA8tnEXDCDplUluGXNXGuiYuy25iF2fJOyizkFD04s",
  "https://mega.nz/embed/jUlWySob#EMuz84RTQxLJHXsJcUnPhV2luRkn4Nve__DCMwlwTfw",
  "https://mega.nz/embed/7dMRRa7K#MRr9cbcu3hqy6va35oG_bdmN5ngNvi1mjxnE8sY_D-o",
  "https://mega.nz/embed/jJdAhJaI#F1kqNHK_pWzVTupP5dU0ZO1yftG2TTn6cOsVEYg1e6U",
  "https://mega.nz/embed/2Y8GGQBR#dIwSpgv7jfe4AOO3AOUk8MGIde3M5kbSkQWOPSAkJgw",
  "https://mega.nz/embed/qQkWXR5R#1JRor8JxNVBM8KSuC1JCqDz-cW-lbPmTffNG41Gy6Ng",
  "https://mega.nz/embed/Ld80Sb5Q#xdnOjYTz_udzRKHeBwe1Kf8OPoU_g0Ibfgpb6-_heGg",
  "https://mega.nz/embed/mZcRnZAY#2m4sdSq6gp3mwX_jAJGsynxPUoFtIUsUqeF9phN-d4M",
  "https://mega.nz/embed/uI0S1JoC#yxGYgcTfAQ8XdfJ7rQJ-i2YdiraJ8hMgtpHu1PW928E",
  "https://mega.nz/embed/bENhkajK#OEozVmStlUQ6dGXvKu9OGMhfbqo9XBjiR4cwdIXZ3nE",
  "https://mega.nz/embed/KF92yLDA#ZsQQrakYmlAMto8eiR2aDqZy3txX55A1ihSKbXHJbbE",
  "https://mega.nz/embed/yR0WGIjZ#wwDgOp_b0BHeOLwCoP3FvRegfyQUKlG4YhCCvc4VMyI",
  "https://mega.nz/embed/XEkClahL#pxYx3FEmqRr5pp9jemb_PJOejiSw8hX-pw2DU_D5iCE",
  "https://mega.nz/embed/PAt1nS4D#SljrWsDwZvaV6QchsYnijdErtGsSVUqQKdA-VevrLwk",
  "https://mega.nz/embed/CMEDFDJB#wYhdkADafHHU-FizKRl-ovfq7QgtuY4B7kVMX5SZEtI",
  "https://mega.nz/embed/rUFy0ZRK#1vzOabfN7Z_Wowbai0d2ihqHfMlIS8L_5DhL_zJ_2as",
  "https://mega.nz/embed/GB0WGTgI#dyLJljURiTiWn3aWyhd0LTZtMNrz_sgmmU1oc2tuQiMw",
  "https://mega.nz/embed/vMsRhAQZ#uD1KWXMMREUqUv8cvpBCfhgSP_j5ry1RuyVHt0L9zGQ",
  "https://mega.nz/embed/iYMGhS6L#xq--vf3cPsGxRdXATaBtjg9nY6ES8E16CyfRA2iuJus",
  "https://mega.nz/embed/CV010AgA#XJek0mZYDbCxDlJa3sMXjYfn97E-yY0Wh4dlXZBvDQk",
  "https://mega.nz/embed/bc1jiSJB#b_N1KdGMWUm55-zLD3cTA8oBgXT5d_ZmPFJRDQRFbfE",
  "https://mega.nz/embed/6FUEWLQL#HPPIky3mrF9SLeceL_QMGG9aXKYy58PF7Ii1776FA_Y"
];

export default function Home() {
  const [currentVideo, setCurrentVideo] = useState(videos[0]);

  const changeVideo = () => {
    const randomIndex = Math.floor(Math.random() * videos.length);
    setCurrentVideo(videos[randomIndex]);
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
      }}
    >
      <iframe
        width="1000"
        height="500"
        frameBorder="0"
        src={currentVideo}
        allowFullScreen
      ></iframe>
      <button
        onClick={changeVideo}
        style={{ marginTop: "20px", padding: "10px 20px", fontSize: "16px" }}
      >
        Сменить видео
      </button>
    </div>
  );
}
