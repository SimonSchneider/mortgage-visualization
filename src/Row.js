import React from  'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import { connect } from 'react-redux'

function Table2(props) {
  return (<div><div>hellos</div><ReactTable  data = {[{name: 'banan', number: 2}, {name: 'test', number: 1}]} columns= {[{Header: 'Name', accessor: 'name'}, {Header: 'Number', accessor: 'number'}]}/></div>);

}


// function Row(props) {
//   return (<td>This is a {props.value}</td>);
// }

export default Table2;
// export default Row;