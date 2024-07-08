'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Edges } from '@react-three/drei';
import * as THREE from 'three';

const CubeScene = () => {
    const sphereRef = useRef();
    const velocity = useRef(new THREE.Vector3(
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05
    ));

    useFrame((state, delta) => {
        if (sphereRef.current) {
            sphereRef.current.position.add(velocity.current);

            const boxSize = 7;
            const sphereSize = 0.5;

            if (Math.abs(sphereRef.current.position.x) > boxSize - sphereSize) {
                velocity.current.x *= -1;
            }
            if (Math.abs(sphereRef.current.position.y) > boxSize - sphereSize) {
                velocity.current.y *= -1;
            }
            if (Math.abs(sphereRef.current.position.z) > boxSize - sphereSize) {
                velocity.current.z *= -1;
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={1} />
            <mesh>
                <boxGeometry args={[14, 14, 14]} />
                <meshStandardMaterial color="white" side={THREE.BackSide} transparent opacity={0.1} />
                <Edges color="blue" threshold={15} />
            </mesh>
            <mesh ref={sphereRef}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <OrbitControls target={[0, 0, 0]} enableZoom={true} enablePan={true} />
        </>
    );
};

const PipeScene = () => {
    const sphereRef = useRef();
    const velocity = useRef(new THREE.Vector3(
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05,
        Math.random() * 0.1 - 0.05
    ));

    useFrame((state, delta) => {
        if (sphereRef.current) {
            sphereRef.current.position.add(velocity.current);

            const pipeLength = 14;
            const pipeRadius = 3;
            const sphereRadius = 0.5;

            // X축 방향 충돌 (파이프 길이)
            if (Math.abs(sphereRef.current.position.x) > pipeLength / 2 - sphereRadius) {
                velocity.current.x *= -1;
            }

            // Y축과 Z축 방향 충돌 (파이프 반지름)
            const distanceFromCenter = Math.sqrt(
                sphereRef.current.position.y ** 2 + sphereRef.current.position.z ** 2
            );
            if (distanceFromCenter > pipeRadius - sphereRadius) {
                // 반사 벡터 계산
                const normal = new THREE.Vector3(0, sphereRef.current.position.y, sphereRef.current.position.z).normalize();
                velocity.current.reflect(normal);
            }
        }
    });

    return (
        <>
            <ambientLight intensity={0.5} />
            <pointLight position={[0, 0, 0]} intensity={1} />
            <mesh rotation={[0, 0, Math.PI / 2]}>
                <cylinderGeometry args={[3, 3, 14, 32, 1, true]} />
                <meshStandardMaterial color="white" side={THREE.BackSide} transparent opacity={0.1} />
                <Edges color="green" threshold={15} />
            </mesh>
            <mesh ref={sphereRef}>
                <sphereGeometry args={[0.5, 32, 32]} />
                <meshStandardMaterial color="red" />
            </mesh>
            <OrbitControls target={[0, 0, 0]} enableZoom={true} enablePan={true} />
        </>
    );
};


export default function Home() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) {
        return null;
    }

    return (
        <div>
            <div style={{width: '100%', height: '500px'}}>
                <Canvas camera={{position: [12, 12, 12], fov: 90}}>
                    <CubeScene/>
                </Canvas>
            </div>
            <div style={{width: '100%', height: '500px', marginTop: '20px'}}>
                <Canvas camera={{position: [0, 10, 0], fov: 90}}>
                    <PipeScene/>
                </Canvas>
            </div>
        </div>
    );
}