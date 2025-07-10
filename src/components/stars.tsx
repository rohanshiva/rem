import * as React from 'react'
import { Points, Vector3, Spherical, Color } from 'three'

type StarsProps = {
  radius?: number;
  depth?: number;
  count?: number;
  factor?: number;
  fade?: boolean;
  speed?: number;
  color?: string;
}

const genStar = (r: number) => {
  return new Vector3().setFromSpherical(new Spherical(r, Math.acos(1 - Math.random() * 2), Math.random() * 2 * Math.PI))
}

export const Stars = React.forwardRef<Points, StarsProps>(
  ({ radius = 100, depth = 50, count = 5000, factor = 4, fade = false, speed = 1, color = '#ffffff' }, ref) => {
    const [position, colors] = React.useMemo(() => {
      const positions: any[] = []
      const colorArray: any[] = []
      const starColor = new Color(color)
      let r = radius + depth
      const increment = depth / count
      for (let i = 0; i < count; i++) {
        r -= increment * Math.random()
        positions.push(...genStar(r).toArray())
        // Use the provided color for all stars with slight brightness variation
        const brightness = 0.7 + Math.random() * 0.3
        colorArray.push(starColor.r * brightness, starColor.g * brightness, starColor.b * brightness)
      }
      return [new Float32Array(positions), new Float32Array(colorArray)]
    }, [count, depth, factor, radius, color])

    return (
      <points ref={ref}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[position, 3]} />
          <bufferAttribute attach="attributes-color" args={[colors, 3]} />
        </bufferGeometry>
        <pointsMaterial
          size={factor * 0.1}
          sizeAttenuation={true}
          vertexColors={true}
          transparent={true}
          depthWrite={false}
        />
      </points>
    )
  }
) 