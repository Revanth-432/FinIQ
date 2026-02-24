const fs = require('fs');

const url = 'https://biqongrnjtstjibkmdqm.supabase.co/rest/v1/modules?select=id,title,lessons(id,title,cards(id,type,content,metadata,order_index))';
const key = 'sb_publishable_agkxAgKaDfA8uQIMw42zug_VyaciHjX';

fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } })
    .then(res => res.json())
    .then(data => {
        fs.writeFileSync('db_dump.json', JSON.stringify(data, null, 2));
        console.log('Supabase dump completed. File: db_dump.json');
    })
    .catch(console.error);
