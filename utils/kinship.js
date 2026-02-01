// utils/kinship.js
// 亲戚关系计算逻辑
// 核心思想：将所有关系映射为代码（f:父, m:母, h:夫, w:妻, s:子, d:女, xb:兄, db:弟, xs:姐, ms:妹）
// 然后通过链式查找获取结果

const relationshipMap = {
    // 基础映射
    '爸爸': 'f', '父亲': 'f', '爹': 'f',
    '妈妈': 'm', '母亲': 'm', '娘': 'm',
    '老公': 'h', '丈夫': 'h',
    '老婆': 'w', '妻子': 'w',
    '儿子': 's',
    '女儿': 'd',
    '哥哥': 'ob', '兄': 'ob',
    '弟弟': 'lb', '弟': 'lb',
    '姐姐': 'os', '姐': 'os',
    '妹妹': 'ls', '妹': 'ls',

    // 复杂关系映射表 (code -> result)
    // 父系
    'f,f': '爷爷',
    'f,m': '奶奶',
    'f,ob': '伯父',
    'f,lb': '叔叔',
    'f,os': '姑妈',
    'f,ls': '姑姑',
    'f,f,f': '太爷爷',
    'f,f,m': '太奶奶',

    // 母系
    'm,f': '外公',
    'm,m': '外婆',
    'm,ob': '舅舅',
    'm,lb': '舅舅',
    'm,os': '姨妈',
    'm,ls': '姨妈',

    // 配偶
    'h,f': '公公',
    'h,m': '婆婆',
    'w,f': '岳父',
    'w,m': '岳母',

    // 兄弟姐妹的子女
    'ob,s': '侄子',
    'ob,d': '侄女',
    'lb,s': '侄子',
    'lb,d': '侄女',
    'os,s': '外甥',
    'os,d': '外甥女',
    'ls,s': '外甥',
    'ls,d': '外甥女',

    // 子女的子女
    's,s': '孙子',
    's,d': '孙女',
    'd,s': '外孙',
    'd,d': '外孙女',

    // 更多常见组合
    'f,ob,w': '伯母',
    'f,lb,w': '婶婶',
    'f,os,h': '姑父',
    'm,ob,w': '舅妈',
    'm,os,h': '姨父'
};

// 反向映射（用于显示）
const codeToName = {
    'f': '爸爸', 'm': '妈妈', 'h': '老公', 'w': '老婆',
    's': '儿子', 'd': '女儿',
    'ob': '哥哥', 'lb': '弟弟', 'os': '姐姐', 'ls': '妹妹'
};

/**
 * 将中文称呼转换为代码
 */
function getCode(name) {
    if (!name) return '';
    return relationshipMap[name] || '';
}

/**
 * 计算关系
 * @param {string} call1 称呼1 (如：爸爸)
 * @param {string} call2 称呼2 (如：的爸爸)
 */
function calculate(call1, call2) {
    // 1. 清理输入，去除"的"等字符
    const c1 = call1.replace(/的/g, '').trim();
    const c2 = call2.replace(/的/g, '').trim();

    // 2. 转换为代码
    const code1 = getCode(c1);
    const code2 = getCode(c2);

    if (!code1 || !code2) {
        // 尝试直接处理完整输入（如果用户在第一个框输入了"爸爸的爸爸"）
        if (!code2 && c1.includes('爸爸')) return calculateChain(c1); // 简单回退
        return null;
    }

    // 3. 组合代码
    const chain = `${code1},${code2}`;

    // 4. 查找结果
    const result = relationshipMap[chain];

    // 5. 如果没有直接结果，尝试性别推导（简单版）
    if (!result) {
        if (chain.endsWith(',s')) return '孙辈(男)';
        if (chain.endsWith(',d')) return '孙辈(女)';
        return '远房亲戚';
    }

    return result;
}

module.exports = {
    calculate
};
