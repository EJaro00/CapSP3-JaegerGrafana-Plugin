import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './mainPanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
  .addRadio({
    path: 'displayDimension',
    name: 'Would like to diplay 2D or 3D',
    defaultValue: '2d',
    settings:{
      options:[{
        value: '2d',
        label: '2D',
      },
      {
        value: '3d',
        label: '3D',
      }]
    }
  })
});
