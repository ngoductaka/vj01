
const Convert =(string)=>{
// chia làm 2 trường hợp căn thức có ngoặc √() và không có √
      // check xem cần xử lý bao nhiêu căn thức
      var string_value = string
        .replace(/S/g, '√')
        .replace(/÷/g, '/')
        .replace(/×/g,"*")
        .replace(/π/g,"pi")
        .replace(/log/g,"log10")
        .replace(/ln/g,"log")
        console.log("string_value",string_value)
        if(string.charAt(string.length-1)==="^")
        {
          string_value = string_value.slice(0,string.length-1)
        }
      var list_index = indexesOf(string_value, /√/g);
      for (var i =0; i<list_index.length;i++){
        // lấy vị trí căn thức đầu tiên
        var index = string_value.indexOf("√")
        //check ()
        if(string_value.charAt(index+1)=="(")
        {
          //có ngoặc
          // tìm giá trị trong căn
          var end = string_value.slice(index+1,string_value.length)
          
          var _index = end.indexOf(")");
          var find_ct = ""
          find_ct = end.slice(0,_index+1);
         
          string_value = string_value.replace("√"+find_ct,find_ct+"^(1/2)")

        }
        else
        {
          var list_kt =[]
          var end = string_value.slice(index+1,string_value.length)
          var _cong = end.indexOf("+")
          if(_cong>-1)
          {
            list_kt.push(_cong)
          }
          var _tru = end.indexOf("-")
          if(_tru>-1)
          {
            list_kt.push(_tru)
          }
          var _nhan = end.indexOf("*")
          if(_nhan>-1)
          {
            list_kt.push(_nhan)
          }
          var _chia = end.indexOf("÷")
          if(_chia>-1)
          {
            list_kt.push(_chia)
          }
          var _ps = end.indexOf("/")
          if(_ps>-1)
          {
            list_kt.push(_ps)
          }
          var max = -1
          var find_ct =""
          if(list_kt.length>0)
          {
            max = Math.min(...list_kt)
            find_ct= end.slice(0,max)
          }
          else
          {
            find_ct= end
          }
        }
        string_value = string_value.replace("√"+find_ct,"("+find_ct+")^(1/2)")
      }
      var list_index_root = indexesOf(string_value, /R/g);
      for (var i =0; i<list_index_root.length;i++){
            // lấy vị trí căn thức đầu tiên
        var index = string_value.indexOf("R")
        var index_mu =  string_value.slice(index+1,string_value.length).indexOf(")")

        var func_mu =string_value.slice(index+1,index+index_mu+2)
        if(string_value.charAt(index_mu+2)=="(")
        {
          var end = string_value.slice(index+index_mu+2,string_value.length)
          
          var _index = end.indexOf(")");
          var find_ct = ""
          find_ct = end.slice(0,_index+1);
          string_value = string_value.replace("R"+func_mu+find_ct,find_ct+"^(1/"+index_mu+")")
        }
        else
        {
          var list_kt =[]
          var end = string_value.slice(index+index_mu+2,string_value.length)
          var _cong = end.indexOf("+")
          if(_cong>-1)
          {
            list_kt.push(_cong)
          }
          var _tru = end.indexOf("-")
          if(_tru>-1)
          {
            list_kt.push(_tru)
          }
          var _nhan = end.indexOf("*")
          if(_nhan>-1)
          {
            list_kt.push(_nhan)
          }
          var _chia = end.indexOf("÷")
          if(_chia>-1)
          {
            list_kt.push(_chia)
          }
          var _ps = end.indexOf("/")
          if(_ps>-1)
          {
            list_kt.push(_ps)
          }
          var max = -1
          var find_ct =""
          if(list_kt.length>0)
          {
            max = Math.min(...list_kt)
            find_ct= end.slice(0,max)
          }
          else
          {
            find_ct= end
          }
        }
        string_value = string_value.replace("R"+func_mu+find_ct,"("+find_ct+")"+"^(1/"+func_mu+")")
        }
      return string_value
}


const indexesOf = (string, regex) => {
    var match,
      indexes = [];

    regex = new RegExp(regex);

    while ((match = regex.exec(string))) {
      indexes.push(match.index);
    }

    return indexes;
  };

  export default Convert