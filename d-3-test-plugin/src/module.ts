import { PanelPlugin } from '@grafana/data';
import { SimpleOptions } from './types';
import { SimplePanel } from './SimplePanel';

export const plugin = new PanelPlugin<SimpleOptions>(SimplePanel).setPanelOptions(builder => {
  return builder
    .addTextInput({
      path: 'node',
      name: 'node name',
      description: 'show node name, source, target',
      defaultValue: ''
    })
    .addTextInput({
      path: 'link',
      name: 'Connect exist Nodes',
      description: 'Enter exist source and target ',
      defaultValue: ''
    })
});
