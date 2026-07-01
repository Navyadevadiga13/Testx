import React, { useState, useEffect, useRef } from "react";

function AdminLogin({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    let particlesArray = [];
    const numberOfParticles = 80;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener("resize", () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = 2;
        this.speedX = (Math.random() - 0.5) * 1;
        this.speedY = (Math.random() - 0.5) * 1;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;

        if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
        if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
      }

      draw() {
        ctx.fillStyle = "#00ffcc";
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function init() {
      particlesArray = [];
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function connectParticles() {
      for (let a = 0; a < particlesArray.length; a++) {
        for (let b = a; b < particlesArray.length; b++) {
          let dx = particlesArray[a].x - particlesArray[b].x;
          let dy = particlesArray[a].y - particlesArray[b].y;
          let distance = dx * dx + dy * dy;

          if (distance < 12000) {
            ctx.strokeStyle = "rgba(0,255,200,0.15)";
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
            ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
            ctx.stroke();
          }
        }
      }
    }

    function animate() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particlesArray.forEach((particle) => {
        particle.update();
        particle.draw();
      });

      connectParticles();
      requestAnimationFrame(animate);
    }

    init();
    animate();
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await response.json();

    if (response.ok) {
      onLogin(data);
    } else {
      alert(data.message);
    }
  };

  return (
    <>
      <div className="login-container">
        <canvas ref={canvasRef} className="neural-canvas"></canvas>

        <div className="login-box">
          <h2>Admin Login</h2>

          <form onSubmit={handleLogin}>
            <input
              type="text"
              placeholder="Enter Username"
              required
              onChange={(e) => setUsername(e.target.value)}
            />

            <input
              type="password"
              placeholder="Enter Password"
              required
              onChange={(e) => setPassword(e.target.value)}
            />

            <button type="submit">Login</button>
          </form>
        </div>
      </div>

      {/* ✅ CSS MOVED INSIDE COMPONENT */}
      <style>{`
        body {
          margin: 0;
          font-family: Arial, sans-serif;
          background: #000;
          color: #fff;
          overflow: hidden;
        }

        * {
          box-sizing: border-box;
        }

        .login-container {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;
        }

        .neural-canvas {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 0;
          background: radial-gradient(circle at center, #050505 0%, #000000 100%);
        }

        .login-box {
          position: relative;
          z-index: 2;
          background: #111;
          padding: 40px 30px;
          width: 320px;
          border-radius: 12px;
          text-align: center;
          border: 1px solid #00cc66;
          box-shadow: 0 0 15px rgba(0, 204, 102, 0.3);
        }

        .login-box h2 {
          margin-bottom: 20px;
        }

        .login-box input {
          width: 100%;
          padding: 12px;
          margin: 12px 0;
          background: #1a1a1a;
          border: 1px solid #00f7ff;
          border-radius: 6px;
          color: #fff;
          transition: 0.3s;
        }

        .login-box input:focus {
          outline: none;
          border-color: #00cc66;
          box-shadow: 0 0 5px #00cc66;
        }

        .login-box button {
          width: 100%;
          padding: 12px;
          margin-top: 16px;
          background: #00cc66;
          border: none;
          color: #fff;
          border-radius: 6px;
          cursor: pointer;
          font-weight: bold;
          transition: 0.3s;
        }

        .login-box button:hover {
          background: #00994d;
          box-shadow: 0 0 10px #00cc66;
        }
      `}</style>
    </>
  );
}

export default AdminLogin;