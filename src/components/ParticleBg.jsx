import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";

const ParticleBg = () => {
  const [init, setInit] = useState(false);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setInit(true);
    });
  }, []);

  const particlesLoaded = (container) => {
    console.log("Particles loaded:", container);
    // Add small delay before showing particles for smoother appearance
    setTimeout(() => {
      setLoaded(true);
    }, 100);
  };

  const options = useMemo(
    () => ({
      fullScreen: {
        enable: false,
        zIndex: 0
      },
      background: {
        color: {
          value: "transparent"
        }
      },
      fpsLimit: 120,
      smooth: true,
      interactivity: {
        events: {
          onClick: {
            enable: true,
            mode: "push"
          },
          onHover: {
            enable: true,
            mode: ["grab", "bubble"]
          },
          resize: {
            enable: true,
            delay: 0.5
          }
        },
        modes: {
          push: {
            quantity: 3
          },
          grab: {
            distance: 140,
            links: {
              opacity: 0.8,
              color: "#60a5fa"
            }
          },
          bubble: {
            distance: 200,
            size: 8,
            duration: 2,
            opacity: 0.8,
            speed: 3
          },
          repulse: {
            distance: 150,
            duration: 0.6,
            speed: 1,
            easing: "ease-out-quad"
          }
        }
      },
      particles: {
        color: {
          value: ["#3b82f6", "#60a5fa", "#93c5fd"]
        },
        links: {
          color: "#3b82f6",
          distance: 150,
          enable: true,
          opacity: 0.4,
          width: 1.5,
          triangles: {
            enable: false
          }
        },
        move: {
          enable: true,
          speed: { min: 0.5, max: 1.5 },
          direction: "none",
          random: true,
          straight: false,
          outModes: {
            default: "bounce"
          },
          attract: {
            enable: true,
            rotateX: 600,
            rotateY: 1200
          },
          bounce: true,
          warp: false
        },
        number: {
          density: {
            enable: true,
            area: 800
          },
          value: 60,
          limit: 100
        },
        opacity: {
          value: { min: 0.3, max: 0.8 },
          animation: {
            enable: true,
            speed: 0.5,
            minimumValue: 0.3,
            sync: false
          }
        },
        shape: {
          type: "circle"
        },
        size: {
          value: { min: 1, max: 4 },
          animation: {
            enable: true,
            speed: 2,
            minimumValue: 1,
            sync: false
          }
        },
        twinkle: {
          particles: {
            enable: true,
            frequency: 0.05,
            opacity: 1
          }
        }
      },
      detectRetina: true
    }),
    []
  );

  if (init) {
    return (
      <Particles
        id="tsparticles"
        particlesLoaded={particlesLoaded}
        options={options}
        style={{
          position: "",
          width: "",
          height: "",
          top: 0,
          left: 0,
          zIndex: 0,
          opacity: loaded ? 1 : 0,
          transition: "opacity 1s ease-in-out"
        }}
      />
    );
  }

  return <></>;
};

export default ParticleBg;