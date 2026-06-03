import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

interface ModelSceneProps {
    modelPath: string;
    className?: string;
}

export function ModelScene({ modelPath, className }: ModelSceneProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!containerRef.current || !canvasRef.current) return;

        const container = containerRef.current;
        const canvas = canvasRef.current;

        // 1. Setup scene
        const scene = new THREE.Scene();

        // 2. Setup camera
        const camera = new THREE.PerspectiveCamera(
            45,
            container.clientWidth / container.clientHeight,
            0.1,
            100
        );
        camera.position.set(0, 0, 5);

        // 3. Setup renderer
        const renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true,
            antialias: true,
            powerPreference: 'high-performance',
        });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.shadowMap.enabled = true;

        // 4. Setup Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
        scene.add(ambientLight);

        // Main directional light (simulating high-contrast shadow)
        const dirLight = new THREE.DirectionalLight(0x991b1b, 3.0); // Maroon/crimson light
        dirLight.position.set(5, 5, 5);
        scene.add(dirLight);

        // Soft secondary blue-ish light for JJK contrast
        const fillLight = new THREE.DirectionalLight(0x0ea5e9, 1.5);
        fillLight.position.set(-5, 3, 2);
        scene.add(fillLight);

        // Specular glow point light
        const glowLight = new THREE.PointLight(0xdc2626, 4.0, 10);
        glowLight.position.set(0, 1, 2);
        scene.add(glowLight);

        // 5. Load model
        const loader = new GLTFLoader();
        let model: THREE.Group | null = null;
        let headBone: THREE.Object3D | null = null;
        let neckBone: THREE.Object3D | null = null;

        // Track target rotation
        const targetRotation = { x: 0, y: 0 };
        const currentRotation = { x: 0, y: 0 };

        loader.load(
            modelPath,
            (gltf) => {
                model = gltf.scene;
                scene.add(model);

                // Enable shadow casting/receiving on children
                model.traverse((child: any) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        // Boost materials/colors slightly if needed
                        if (child.material) {
                            child.material.roughness = 0.6;
                            child.material.metalness = 0.2;
                        }
                    }
                    
                    // Search for head/neck bones
                    const nameLower = child.name.toLowerCase();
                    if (!headBone && (nameLower.includes('head') || nameLower.includes('cabeça'))) {
                        headBone = child;
                    }
                    if (!neckBone && (nameLower.includes('neck') || nameLower.includes('pescoço'))) {
                        neckBone = child;
                    }
                });

                // Auto-center and fit model in camera view
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());

                // Reposition model to center it at origin
                model.position.x += (model.position.x - center.x);
                model.position.y += (model.position.y - center.y);
                model.position.z += (model.position.z - center.z);

                // Pivot offsets if needed, e.g. shift slightly down to focus on torso/head
                model.position.y -= size.y * 0.1;

                // Adjust camera distance depending on model size
                const maxDim = Math.max(size.x, size.y, size.z);
                const fov = camera.fov * (Math.PI / 180);
                let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
                cameraZ *= 1.4; // Zoom pad
                camera.position.z = cameraZ;
                camera.lookAt(0, 0, 0);

                setLoading(false);
            },
            (xhr) => {
                // Progress
            },
            (err) => {
                console.error('Failed to load 3D model:', err);
                setError('Could not render 3D character.');
                setLoading(false);
            }
        );

        // 6. Handle interaction (mouse tracking)
        const handleMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Target rotations (yaw and pitch limit angles)
            targetRotation.y = x * 0.5; // Max 30 degrees yaw
            targetRotation.x = y * 0.35; // Max 20 degrees pitch
        };

        window.addEventListener('mousemove', handleMouseMove);

        // 7. Animation Loop
        let animationFrameId: number;
        const clock = new THREE.Clock();

        const animate = () => {
            animationFrameId = requestAnimationFrame(animate);

            // Interpolate smoothly (Lerp) towards target mouse rotation
            currentRotation.x += (targetRotation.x - currentRotation.x) * 0.08;
            currentRotation.y += (targetRotation.y - currentRotation.y) * 0.08;

            if (model) {
                // If we found head/neck bones, rotate them for natural look. 
                // Otherwise, rotate the entire model slightly.
                if (headBone) {
                    headBone.rotation.y = currentRotation.y * 0.8;
                    headBone.rotation.x = currentRotation.x * 0.8;
                } else if (neckBone) {
                    neckBone.rotation.y = currentRotation.y * 0.8;
                    neckBone.rotation.x = currentRotation.x * 0.8;
                } else {
                    // Turn entire character model
                    model.rotation.y = currentRotation.y;
                    model.rotation.x = currentRotation.x * 0.5;
                }

                // Add gentle natural floating animation
                const elapsedTime = clock.getElapsedTime();
                model.position.y = (-size.y * 0.1) + Math.sin(elapsedTime * 1.5) * 0.05;
            }

            renderer.render(scene, camera);
        };
        animate();

        // 8. Handle Resize
        const handleResize = () => {
            camera.aspect = container.clientWidth / container.clientHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(container.clientWidth, container.clientHeight);
        };
        const resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);

        // Clean up
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener('mousemove', handleMouseMove);
            resizeObserver.disconnect();
            renderer.dispose();
        };
    }, [modelPath]);

    return (
        <div ref={containerRef} className={`relative overflow-hidden w-full h-full flex items-center justify-center ${className}`}>
            {loading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 z-10">
                    <span className="w-8 h-8 border-2 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></span>
                </div>
            )}
            {error && (
                <div className="absolute inset-0 flex items-center justify-center text-red-500 font-mono text-[10px] uppercase tracking-wider bg-black/60 p-4 z-10 text-center">
                    {error}
                </div>
            )}
            <canvas ref={canvasRef} className="w-full h-full block bg-transparent" />
        </div>
    );
}
