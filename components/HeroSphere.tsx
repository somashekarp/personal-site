'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

// Particle sphere inside its bento tile. The mouse pushes particles away and
// makes them glow, a click sends a pulse through them, and scrolling turns it.
// It only renders while the tile is on screen.

const vertexShader = /* glsl */ `
uniform float uTime;
uniform float uSize;
uniform float uPixelRatio;
uniform vec3 uMouse;
uniform float uPresence;
uniform float uCharge;
uniform vec3 uPulse;
attribute float aRand;
varying float vHeat;
varying float vRand;

vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c * p.x + s * p.z, p.y, -s * p.x + c * p.z); }

void main() {
	vec3 pos = rotY(position, uTime * .12);
	pos *= 1. + .06 * sin(3. * pos.y + uTime) * cos(2. * pos.x + uTime * .7);
	pos += .035 * sin(uTime * .6 + aRand * 40. + pos.yzx * 2.);

	vec4 world = modelMatrix * vec4(pos, 1.);

	// Mouse: push particles away
	vec2 away = world.xy - uMouse.xy;
	float force = (1. - smoothstep(0., 1.5, length(away))) * uPresence * (.35 + uCharge);
	world.xy += normalize(away + 1e-4) * force * .7;
	world.z += force * .5;

	// Click: an expanding ring
	float age = uTime - uPulse.z;
	vec2 fromClick = world.xy - uPulse.xy;
	float ring = exp(-pow((length(fromClick) - age * 4.) * 2.5, 2.)) * exp(-age * 1.1);
	world.xy += normalize(fromClick + 1e-4) * ring * .45;
	world.z += ring * .6;

	vHeat = clamp(force + ring, 0., 1.);
	vRand = aRand;
	vec4 mv = viewMatrix * world;
	gl_Position = projectionMatrix * mv;
	gl_PointSize = uSize * (.5 + aRand) * (1. + vHeat * 1.5) * uPixelRatio / -mv.z;
}`;

const fragmentShader = /* glsl */ `
uniform vec3 uColA;
uniform vec3 uColB;
uniform vec3 uHot;
varying float vHeat;
varying float vRand;

void main() {
	float a = 1. - smoothstep(0., .5, length(gl_PointCoord - .5));
	vec3 col = mix(mix(uColA, uColB, vRand), uHot, vHeat);
	gl_FragColor = vec4(col, a * a * (.55 + vHeat));
	#include <colorspace_fragment>
}`;

const damp = (a: number, b: number, k: number, dt: number) => a + (b - a) * (1 - Math.pow(1 - k, dt * 60));

export default function HeroSphere() {
	const ref = useRef<HTMLCanvasElement>(null);

	useEffect(() => {
		const canvas = ref.current;
		const tile = canvas?.parentElement;
		if (!canvas || !tile) return;
		return startSphere(canvas, tile);
	}, []);

	return <canvas ref={ref} className="sphere-canvas" aria-hidden="true" />;
}

function startSphere(canvas: HTMLCanvasElement, tile: HTMLElement) {
	const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
	const count = matchMedia('(max-width: 760px)').matches ? 6000 : 11000;

	let renderer: THREE.WebGLRenderer;
	try {
		renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: 'high-performance' });
	} catch {
		canvas.style.display = 'none';   // no WebGL: the tile keeps its gradient
		return;
	}
	renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

	const scene = new THREE.Scene();
	const camera = new THREE.PerspectiveCamera(45, 1, .1, 50);
	camera.position.z = 6;

	// Fibonacci sphere with a slightly thick shell
	const positions = new Float32Array(count * 3);
	const rand = new Float32Array(count);
	const golden = Math.PI * (3 - Math.sqrt(5));
	for (let i = 0; i < count; i++) {
		const y = 1 - 2 * (i + .5) / count;
		const rad = Math.sqrt(1 - y * y);
		const r = 1.55 + (Math.random() - .5) * .16;
		positions.set([Math.cos(golden * i) * rad * r, y * r, Math.sin(golden * i) * rad * r], i * 3);
		rand[i] = Math.random();
	}
	const geometry = new THREE.BufferGeometry();
	geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
	geometry.setAttribute('aRand', new THREE.BufferAttribute(rand, 1));

	const uniforms = {
		uTime: { value: 0 },
		uSize: { value: 30 },
		uPixelRatio: { value: renderer.getPixelRatio() },
		uMouse: { value: new THREE.Vector3(99, 99, 0) },
		uPresence: { value: 0 },
		uCharge: { value: 0 },
		uPulse: { value: new THREE.Vector3(0, 0, -100) },
		uColA: { value: new THREE.Color('#4d7cff') },
		uColB: { value: new THREE.Color('#b36bff') },
		uHot: { value: new THREE.Color('#ffc53d') },
	};
	const material = new THREE.ShaderMaterial({
		uniforms,
		vertexShader,
		fragmentShader,
		transparent: true,
		depthWrite: false,
		blending: THREE.AdditiveBlending,
	});
	const points = new THREE.Points(geometry, material);
	points.frustumCulled = false;
	scene.add(points);

	// Size the sphere to fill about two thirds of the tile, whatever its shape
	function resize() {
		const { width, height } = canvas.getBoundingClientRect();
		renderer.setSize(width, height, false);
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		points.scale.setScalar(Math.min(1, camera.aspect) * 1.05);
	}

	const cleanup = new AbortController();
	const { signal } = cleanup;
	resize();
	addEventListener('resize', resize, { signal });

	const dispose = () => {
		cleanup.abort();
		renderer.setAnimationLoop(null);
		geometry.dispose();
		material.dispose();
		renderer.dispose();
	};

	if (reduce) {
		renderer.render(scene, camera);
		addEventListener('resize', () => renderer.render(scene, camera), { signal });
		return dispose;
	}

	// Screen point -> where it hits the z = 0 plane in world space
	const ray = new THREE.Vector3();
	function toWorld(e: PointerEvent | MouseEvent, out: THREE.Vector3) {
		const r = canvas.getBoundingClientRect();
		ray.set((e.clientX - r.left) / r.width * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1, .5)
			.unproject(camera).sub(camera.position).normalize();
		return out.copy(camera.position).addScaledVector(ray, -camera.position.z / ray.z);
	}

	const target = new THREE.Vector3(99, 99, 0);
	const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
	let present = false;
	let charge = 0;
	let lastPos: { x: number; y: number } | null = null;

	tile.addEventListener('pointermove', (e) => {
		toWorld(e, target);
		const r = tile.getBoundingClientRect();
		tilt.tx = ((e.clientY - r.top) / r.height - .5) * .6;
		tilt.ty = ((e.clientX - r.left) / r.width - .5) * .8;
		if (lastPos) charge = Math.min(1, charge + Math.hypot(e.clientX - lastPos.x, e.clientY - lastPos.y) / 140);
		lastPos = { x: e.clientX, y: e.clientY };
		present = true;
	}, { signal });
	tile.addEventListener('pointerleave', () => {
		present = false;
		lastPos = null;
		tilt.tx = tilt.ty = 0;
	}, { signal });
	tile.addEventListener('pointerup', (e) => { if (e.pointerType !== 'mouse') present = false; }, { signal });
	tile.addEventListener('click', (e) => {
		const at = toWorld(e, new THREE.Vector3());
		uniforms.uPulse.value.set(at.x, at.y, uniforms.uTime.value);
	}, { signal });

	let time = 0;
	let last = performance.now();
	function loop(now: number) {
		const dt = Math.min((now - last) / 1000, .1);
		last = now;
		time += dt;

		charge = damp(charge, 0, .04, dt);
		uniforms.uTime.value = time;
		uniforms.uCharge.value = charge;
		uniforms.uPresence.value = damp(uniforms.uPresence.value, present ? 1 : 0, .08, dt);
		uniforms.uMouse.value.lerp(target, 1 - Math.pow(.85, dt * 60));

		tilt.x = damp(tilt.x, tilt.tx, .04, dt);
		tilt.y = damp(tilt.y, tilt.ty, .04, dt);
		points.rotation.x = tilt.x;
		points.rotation.y = tilt.y + Math.sin(time * .12) * .35 + scrollY * .0015;

		renderer.render(scene, camera);
	}

	// Pause when the tile is scrolled out of view
	const observer = new IntersectionObserver(([entry]) => {
		last = performance.now();
		renderer.setAnimationLoop(entry.isIntersecting ? loop : null);
	});
	observer.observe(tile);

	return () => {
		observer.disconnect();
		dispose();
	};
}
