  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
    
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.005
      meshRef.current.rotation.z += 0.002

      const targetScale = activeNode === id ? 15 : (hovered && !activeNode ? 1.2 : 1);
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.04);

      // STRICT VERTICAL HIDING: If the camera is more than 15 units away, hide the text
      if (htmlRef.current) {
        const dist = state.camera.position.distanceTo(meshRef.current.position);
        if (dist > 15) {
          htmlRef.current.style.opacity = '0';
          htmlRef.current.style.pointerEvents = 'none';
        } else {
          htmlRef.current.style.opacity = hovered ? '1' : '0.4';
          htmlRef.current.style.transform = hovered ? 'translateX(10px)' : 'translateX(0px)';
        }
      }
    }
  })
