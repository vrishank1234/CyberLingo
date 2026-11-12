/**
 * PathConnector Component
 * Draws the smooth SVG winding path connecting successive lesson nodes.
 */

import PropTypes from 'prop-types';

export default function PathConnector({ totalNodes = 3, nodeOffsets = [0, -45, 45] }) {
  // SVG coordinates: container width 320, vertical node spacing ~120px
  const width = 320;
  const nodeSpacing = 120;
  const height = totalNodes * nodeSpacing;
  const centerX = width / 2;

  // Build SVG path string connecting node centers
  let pathD = `M ${centerX + (nodeOffsets[0] || 0)} 40`;

  for (let i = 1; i < totalNodes; i++) {
    const prevX = centerX + (nodeOffsets[i - 1] || 0);
    const prevY = (i - 1) * nodeSpacing + 40;
    const currX = centerX + (nodeOffsets[i] || 0);
    const currY = i * nodeSpacing + 40;

    const midY = (prevY + currY) / 2;
    pathD += ` C ${prevX} ${midY}, ${currX} ${midY}, ${currX} ${currY}`;
  }

  return (
    <svg
      className="absolute top-0 inset-x-0 w-full pointer-events-none z-0"
      style={{ height: `${height}px` }}
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="none"
      fill="none"
    >
      {/* Background Gray Connector */}
      <path
        d={pathD}
        stroke="#E5E5E5"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
}

PathConnector.propTypes = {
  totalNodes: PropTypes.number,
  nodeOffsets: PropTypes.arrayOf(PropTypes.number)
};

