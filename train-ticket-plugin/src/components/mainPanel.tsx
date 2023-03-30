import React from 'react';
import { PanelProps} from '@grafana/data';
import { SimpleOptions } from 'types';
import graph2d from './2DVersion';
import graph3d from './3DVersion';

interface Props extends PanelProps<SimpleOptions> {}


export const SimplePanel: React.FC<Props> = ({ options, data, width, height }) => {
    
  
  if(options.displayDimension === '3d'){
      return graph3d({data, width,height});
    }
    return graph2d({data, width, height});
};
