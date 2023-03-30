import {PanelData} from '@grafana/data';
import { useEffect, useState } from 'react';

type Props = {
    data: PanelData;
}

const getData: React.FC<Props> = ({data}) =>{
    const [nodes, setNodes] = useState<any>([]); //nodes array
    const [links, setLinks] = useState<any>([]); //links array
     useEffect(() => {
        function add (){
            const index = data.series.map((series) => series.fields.find((field) => field.name === 'Index'));
            const name = data.series.map((series) => series.fields.find((field) => field.name === 'Name'));
            const source = data.series.map((series) => series.fields.find((field) => field.name === 'Source'));
            let array = index[0]?.values
            const newNodes = [] as any;
            const newLinks = [] as any;
            for(let i = 0; i < (array?.length as number) ; i++){
              let p = (array?.get(i) as number) 
              let n = name[0]?.values.get(i)
              let s = source[0]?.values.get(i)
              if(p !== null && n !== null){
                newNodes.push({'id': p, 'name': n})
                if(i > 0){
                    newLinks.push({'source': s, 'target': p})
                }
              }
            }
            setNodes(newNodes)
            setLinks(newLinks)
        }
        add()
    },[data])
}
export default getData