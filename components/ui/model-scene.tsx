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

        console.log('ModelScene: Initializing for', modelPath);

        // 1. Setup scene
        const scene = new THREE.Scene();

        // 2. Setup camera with safe initial dimensions
        const initialWidth = container.clientWidth || 380;
        const initialHeight = container.clientHeight || 500;
        
        const camera = new THREE.PerspectiveCamera(
            45,
            initialWidth / initialHeight,
            0.01,
            1000
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
        renderer.setSize(initialWidth, initialHeight);
        renderer.shadowMap.enabled = true;

        // 4. Setup Lighting (Very bright and high-contrast)
        const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
        scene.add(ambientLight);

        // Strong main light
        const dirLight = new THREE.DirectionalLight(0xffffff, 4.0);
        dirLight.position.set(5, 8, 5);
        scene.add(dirLight);

        // Red/Crimson blood thematic fill light
        const fillLight = new THREE.DirectionalLight(0x991b1b, 5.0);
        fillLight.position.set(-6, 4, 3);
        scene.add(fillLight);

        // White front light to make sure details are lit
        const frontLight = new THREE.DirectionalLight(0xffffff, 3.0);
        frontLight.position.set(0, 0, 8);
        scene.add(frontLight);

        // 5. Load model
        const loader = new GLTFLoader();
        let model: THREE.Group | null = null;
        let headBone: THREE.Object3D | null = null;
        let neckBone: THREE.Object3D | null = null;

        // Track target rotation
        const targetRotation = { x: 0, y: 0 };
        const currentRotation = { x: 0, y: 0 };
        let modelSizeY = 1.0;

        loader.load(
            modelPath,
            (gltf) => {
                console.log('ModelScene: GLTF loaded successfully', gltf);
                model = gltf.scene;
                scene.add(model);

                // Enable shadow casting/receiving on children
                model.traverse((child: any) => {
                    if (child.isMesh) {
                        child.castShadow = true;
                        child.receiveShadow = true;
                        if (child.material) {
                            child.material.roughness = 0.5;
                            child.material.metalness = 0.1;
                            // Ensure textures are fully illuminated
                            child.material.needsUpdate = true;
                        }
                    }
                    
                    // Search for head/neck bones
                    const nameLower = child.name.toLowerCase();
                    if (!headBone && (nameLower.includes('head') || nameLower.includes('cabeça'))) {
                        headBone = child;
                        console.log('ModelScene: Found head bone:', child.name);
                    }
                    if (!neckBone && (nameLower.includes('neck') || nameLower.includes('pescoço'))) {
                        neckBone = child;
                        console.log('ModelScene: Found neck bone:', child.name);
                    }
                });

                // Auto-center and fit model in camera view
                const box = new THREE.Box3().setFromObject(model);
                const size = box.getSize(new THREE.Vector3());
                const center = box.getCenter(new THREE.Vector3());
                
                modelSizeY = size.y || 1.0;
                console.log('ModelScene: Model size:', size, 'Center:', center);

                // Exact centering
                model.position.set(-center.x, -center.y - modelSizeY * 0.1, -center.z);

                // Adjust camera distance depending on model size
                const maxDim = Math.max(size.x, size.y, size.z);
                let cameraZ = 5; // Default fallback
                if (maxDim > 0.05) {
                    const fov = camera.fov * (Math.PI / 180);
                    cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2)) * 1.5;
                }
                
                console.log('ModelScene: Camera Z set to', cameraZ);
                camera.position.set(0, 0, cameraZ);
                camera.lookAt(0, 0, 0);

                setLoading(false);
            },
            (xhr) => {
                if (xhr.total > 0) {
                    console.log(`ModelScene: Loading progress: ${(xhr.loaded / xhr.total * 100).toFixed(2)}%`);
                }
            },
            (err) => {
                console.error('ModelScene: Failed to load 3D model:', err);
                setError('Could not render 3D character.');
                setLoading(false);
            }
        );

        // 6. Handle interaction (mouse tracking)
        const handleMouseMove = (event: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            if (rect.width === 0 || rect.height === 0) return;
            const x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            const y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

            // Target rotations
            targetRotation.y = x * 0.4; // Max rotation angle
            targetRotation.x = y * 0.25;
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
                if (headBone) {
                    headBone.rotation.y = currentRotation.y * 0.8;
                    headBone.rotation.x = currentRotation.x * 0.8;
                } else if (neckBone) {
                    neckBone.rotation.y = currentRotation.y * 0.8;
                    neckBone.rotation.x = currentRotation.x * 0.8;
                } else {
                    // Turn entire character model slightly
                    model.rotation.y = currentRotation.y;
                    model.rotation.x = currentRotation.x * 0.3;
                }

                // Add gentle natural floating animation
                const elapsedTime = clock.getElapsedTime();
                const box = new THREE.Box3().setFromObject(model);
                const center = box.getCenter(new THREE.Vector3());
                model.position.y = (-center.y - modelSizeY * 0.1) + Math.sin(elapsedTime * 1.5) * 0.04;
            }

            renderer.render(scene, camera);
        };
        animate();

        // 8. Handle Resize
        const handleResize = () => {
            const w = container.clientWidth;
            const h = container.clientHeight;
            if (w > 0 && h > 0) {
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }
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
