import { PanelProps} from '@grafana/data';
import React from 'react';
import { SimpleOptions } from 'types';
import graph2d from './graph/2DVersion';
import graph3d from './graph/3DVersion';

interface Props extends PanelProps<SimpleOptions> {}

export const SimplePanel: React.FC<Props> = ({options, data, width, height}) => {
  if(/*options.displayDimension === '3d'*/ true){
      return graph3d({data, width,height});
      //return(<h1>still working on it</h1>)
    }
    return graph2d({data, width, height});
};
