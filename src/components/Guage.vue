<template>
  <div>
    <svg width="100%" height="100%" viewBox="0 0 42 42" class="donut animate">
      <defs>
        <filter id="glow-and-blur">
          <feGaussianBlur :stdDeviation="glow" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>
      <circle class="donut-hole" cx="21" cy="21" r="15.91549430918954" :fill="fillInnerBackground"
              :opacity="innerOpacity"></circle>
      <circle class="donut-ring" cx="21" cy="21" r="15.91549430918954" fill="transparent" stroke="#CCCCCC"
              :stroke-width="0.9"></circle>
      <circle :class="`donut-segment chart__ring--${getStrokeColor}`" cx="21" cy="21" r="15.91549430918954"
              fill="transparent" :stroke-dasharray="getCurrentScore" stroke-dashoffset="75" filter="url(#glow-and-blur)"
              :stroke-width="ringWidth-0.5"></circle>
      <g class="chart-text">
        <text x="50%" :y="fillPercentY" class="chart-number"
              :fill="counterFillColor"> {{fillPercentText}}%

        </text>
      </g>
      <g v-if="enableLabel">
        <text x="50%" y="72%" class="chart-label" :fill="counterFillColor"> {{label}}
</text>
      </g>
    </svg>
  </div>
</template>
<script>
export default {
  name: 'DonutBarChart',
  props: {
    fillPercent: {
      type: Number,
      default: 0,
    },
    counterFillColor: {
      type: String,
      default: '#404040',
    },
    ringWidth: {
      type: Number,
      default: 1.5,
    },
    glow: {
      type: Number,
      default: 0.5,
    },
    reverse: {
      type: Boolean,
      default: false,
      description: 'Reverses the colours. Used for things like banding where a higher number is bad.',
    },
    fillInnerBackground: {
      type: String,
      default: 'transparent',
      description: 'Set background colour in circle',
    },
    innerOpacity: {
      type: Number,
      default: 1,
      description: 'Set opacity in circle',
    },
    enableLabel: {
      type: Boolean,
      default: false,
      description: 'Enable/Disable label under the fillPercent',
    },
    label: {
      type: String,
      default: '',
      description: 'Shows label',
    },
    enableCircle: {
      type: Boolean,
      default: true,
      description: 'Enable/Disable outer circle',
    },
  },
  computed: {
    getCurrentScore() {
      return `${this.fillPercent} ${100 - this.fillPercent}`;
    },
    getStrokeColor() {
      let strokeClass = 'empty';
      const quality = this.fillPercent;
      switch (true) {
        case !this.enableCircle:
          break;
        case quality > 0 && quality < 20:
          strokeClass = this.reverse ? 'excellent' : 'bad';
          break;
        case quality >= 20 && quality < 30:
          strokeClass = this.reverse ? 'good' : 'poor';
          break;
        case quality >= 30 && quality < 50:
          strokeClass = 'fair';
          break;
        case quality >= 50 && quality < 80:
          strokeClass = this.reverse ? 'poor' : 'good';
          break;
        case quality >= 80 && quality < 101:
          strokeClass = this.reverse ? 'bad' : 'excellent';
          break;
        default:
      }
      return strokeClass;
    },
    fillPercentText() {
      return this.fillPercent < 0 ? '―' : this.fillPercent;
    },
    fillPercentY() {
      return this.enableLabel ? '42%' : '50%';
    },
  },
};
</script>
<style lang="scss" scoped>

.animate .donut-segment {
 -webkit-transition: stroke-dasharray 0.5s ease-in-out, stroke 0.5s ease-in-out !important;
 -moz-transition: stroke-dasharray 0.5s ease-in-out, stroke 0.5s ease-in-out !important;
 -ms-transition: stroke-dasharray 0.5s ease-in-out, stroke 0.5s ease-in-out !important;
 -o-transition: stroke-dasharray 0.5s ease-in-out, stroke 0.5s ease-in-out !important;
 transition: stroke-dasharray 0.5s ease-in-out, stroke 0.5s ease-in-out !important;
}

.chart-number {
 font-size: 0.8rem;
 line-height: 1;
 text-anchor: middle;
 -moz-transform: translateY(0.35em);
 -ms-transform: translateY(0.35em);
 -webkit-transform: translateY(0.35em);
 transform: translateY(0.35em);
}

.chart__ring {
  &--bad {
    stroke: #EA2227;
  }

  &--poor {
    stroke: #F37B21;
  }


  &--fair {
    stroke: #ED9F32;
  }

  &--good {
    stroke: #9DCB52;
  }

  &--excellent {
    stroke: #00AB4E
  }

  &--empty {
    stroke: #cccccc;
  }
}

.chart-label {
 text-anchor: middle;
 font-size: 6px;
}


</style>
