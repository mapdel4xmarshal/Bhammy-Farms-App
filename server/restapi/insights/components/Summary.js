import Trend from './TrendIcon.js';

const template = `
    <div :style="statsStyle">
        <div v-for="(stat, index) in stats" :key="stat.name" :style="{display: 'flex', padding: '10px'}">
            <v-divider v-if="index !== 0" vertical/>
            <div :style="statStyle">
                <span :style="labelStyle">{{ stat.name }}</span>
                <span :style="currentStyle">{{ stat.current }} {{ stat.metric }}</span>
                <span :style="[diffStyle, { color: '#099829' }]">
                    <Trend v-if="stat.diff" color="#099829" invert class="mr-1"/>
                    {{ stat.diff }} {{ stat.metric }}
                </span>
            </div>
        </div>
    </div>
`;

export default {
  data: function () {
    return {
      stats: [
        {
          name: 'Avg Daily Prod',
          current: 102,
          prev: 100,
          diff: 2,
          metric: 'crates'
        },
        {
          name: 'Avg Daily Prod %',
          current: 102,
          prev: 100,
          diff: 2,
          metric: 'crates'
        },
        {
          name: 'Mortality %',
          current: 0.02,
          prev: 0.01,
          diff: -0.01,
          metric: '%'
        },
        {
          name: 'Total Mortality',
          current: 12,
          prev: 10,
          diff: 2,
          metric: 'birds'
        },
        {
          name: 'Total Mortality',
          current: 12,
          prev: 10,
          diff: 2,
          metric: 'birds'
        },
        {
          name: 'Total Mortality',
          current: 12,
          prev: 10,
          diff: -2,
          metric: 'birds'
        }
      ],
      statsStyle: {
        background: 'rgba(240, 240, 240, 0.5)',
        borderRadius: '5px',
        display: 'flex',
        justifyContent: 'space-between'
      },
      statStyle: {
        display: 'inline-flex',
        flexDirection: 'column',
        margin: '0 10px'
      },
      labelStyle: {
        textTransform: 'uppercase',
        fontStyle: 'normal',
        fontWeight: 300,
        fontSize: '10px',
        color: '#777676'
      },
      currentStyle: {
       // fontSize: '10px'
      },
      diffStyle: {
        fontSize: '10px'
      }
    };
  },
  template,
  components: {
    Trend
  }
};

