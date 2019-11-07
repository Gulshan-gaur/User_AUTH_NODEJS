const neo4j =  require('neo4j-driver');
export const neo = async () => {
    const driver =  neo4j.driver('http://10.118.114.135:7474',neo4j.auth.basic('neo4j','gul20Gul'))
};