# beggar-js-engine

一个乞丐版 javascript 引擎（学习用）。

要编译一门语言，通常需要词法分析、语法分析、语法制导翻译等过程。参考下图：

![](https://tva1.sinaimg.cn/large/008i3skNgy1gty3jsr771j61m40i2aeg02.jpg)

[编译原理的相关内容](https://melogra.github.io/blog/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80/%E7%BC%96%E8%AF%91%E5%8E%9F%E7%90%86/1.%20%E7%BC%96%E8%AF%91%E5%99%A8%E4%BB%8B%E7%BB%8D/)。

## 词法分析

词法分析就是将字符流转换成token的过程。转换过程需要使用[状态机](https://melogra.github.io/blog/%E8%AE%A1%E7%AE%97%E6%9C%BA%E5%9F%BA%E7%A1%80/%E8%AE%A1%E7%AE%97%E6%9C%BA%E7%A7%91%E5%AD%A6/%E6%9C%89%E9%99%90%E7%8A%B6%E6%80%81%E6%9C%BA)。

### 操作符状态机

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqmxa60j30g60mjq4g.jpg" style="zoom:85%;" />

### Number 状态机

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqqs0uuj30gw0a774r.jpg" style="zoom:80%;" />

## 语法分析

有了 token 流，下一步要构建抽象语法树。

抽象语法树的节点主要有 因子（Factor）、表达式（Expr）、语句（Stmt）三大类型。其中 Factor 有变量和字面量（直接量），语句也有 if 语句、for 语句等。它们的关系如下图：

<img src="https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqrjbemj30f807xjro.jpg" style="zoom:80%;" />

### 推导关系

程序由语句构成，有如下推导关系：
$$
Program \to Stmts \to Stmt \ Stmts \ | \ \epsilon \\
Stmt \to ForStmt \ | \ DeclStmt \ | \ AssignStmt \ | \ Function \ \dots \ | \ Block \\
Block \to \{ Stmts \}
$$
解析过程中的调用关系：

![](https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqpvm4wj30gs06ymxf.jpg)

#### 声明语句

$$
DeclareStmt \to var \ Variable = Expr
$$

![](https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqsg90dj30jl011wef.jpg)

#### 赋值语句

$$
AssignStmt \to Variable = Expr
$$

![](https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqop3rwj30fj011gli.jpg)

#### if 语句

$$
IfStmt \to if(Expr) \ Block \ Tail \\
Tail \to else \ Block \ | \ else \ IfStmt \ | \ \epsilon
$$

![](https://tva1.sinaimg.cn/large/008i3skNgy1gx3fqnu6i6j30om03e3ym.jpg)

#### function

$$
Function \to func (Args) \ Type \ Block \\
Args \to Type \ Variable, \ Args \ | \ Type Variable \ | \ \epsilon \\
ReturnType \to Type \ | \ \epsilon \\
Type \to int \ | \ string \ | \ void \ | \ bool \ | \ float
$$

## 左递归和表达式优先级

假设有一个产生式：
$$
A \to A\alpha \:|\: \beta
$$
这个产生式只能推导出以 β 开头的句子，比如：
$$
\beta, \beta\alpha, \beta\alpha\alpha, \beta\alpha\alpha\alpha, \dots
$$
且这个产生式存在左递归，无法使用递归向下算法求解。

为了消除左递归，对产生式做等效替换，得到新的产生式：
$$
A \to \beta A' \\
A' \to \alpha A' \:|\: \epsilon
$$

### 一般情况的左递归处理

针对以下产生式：
$$
A \to A\alpha \:|\: A\beta \:|\: A\gamma \:|\: \lambda
$$
该产生式有几个特点：

* 只能产生以 $\lambda$ 开头的句子
* 可以产生 $\lambda [\alpha\beta\gamma]^*$ 的句子
* 存在左递归

等效替换后的产生式：
$$
A \to \lambda A' \\
A' \to \alpha A' \:|\: \beta A' \:|\: \gamma A' \:|\: \epsilon
$$
来看个例子：求以下产生式的去左递归形式
$$
E \to E + E \:|\: E - E \:|\: d \\
d \to 0|1|2|3|4|5|6|7|8|9
$$
根据上文公式，去左递归的产生式为：
$$
E \to d E' \\
E' \to + EE' \:|\: - EE' \:|\: \epsilon
$$

### 优先级

考虑以下表示四则运算的产生式：
$$
Expr \to Expr + Expr \:|\: Expr - Expr \:|\: Expr * Expr \:|\: Expr / Expr \:|\: Factor \\
Factor \to [0-9]+
$$
该产生式无法提现乘法除法的优先级。比如句子 $1*3+2$ 中，$3+2$ 会先被计算。

为了解决优先级的问题，需要使用两级产生式：
$$
Expr \to Expr + Term \:|\: Expr - Term \:|\: Term \\
Term \to Term * Factor \:|\: Term \:/\: Factor | Factor \\
Factor \to [0-9]+
$$

### 优先级产生式的去左递归

根据去左递归的公式：
$$
A \to \lambda A' \\A' \to \alpha A' \:|\: \beta A' \:|\: \gamma A' \:|\: \epsilon
$$
优先级产生式的去左递归形式如下：
$$
Expr \to Term \: Expr' \\
Expr' \to + Term \: Expr' \:|\: - Term \: Expr' \:|\: \epsilon \\
\\
Term \to Factor \: Term' \\
Term' \to * Factor \: Term' \:|\: / Factor \: Term' \:|\: \epsilon \\
\\
Factor \to [0-9]+
$$

### 操作符优先级的一般情况

假设有如下操作符，按优先级从低到高排列

* $&、|、^
* ==、!=、>、<、>=、<=
* +-
* */
* <<、>>
* ()、++、--、!

令：

* $E_k$表示第 $k$ 优先级的表达式
* $E_{k+1}$表示第 $k+1$ 优先级的表达式
* $op_k$表示第 $k$ 优先级表达式对应的操作符

比如 $E_k \to E_k \ + \ E_{k+1} \ | \ E_{k+1} ,\quad E_{k+1} \to E_{k+1} \ * \  F \ | \ F$

则有：
$$
E_k \to E_k \ op_k \ E_{k+1} \:|\: E_{k+1}
$$
上面这个产生式的去左递归推导过程：
$$
E_k \to E_k \ op_k \ E_{k+1} \:|\: E_{k+1}

\\ \Downarrow \\

E_k \to E_{k+1} \ E_k' \\
E_k' \to op_k \ E_{k+1} \ E_k' \ | \ \epsilon

\\ \Downarrow \dots \\

E_t \to Factor \ E_t' \\
E_t' \to op_t \ Factor \ E_t' \ | \ \epsilon
$$

## 语法制导翻译

### 三地址代码

```javascript
if (a + b > 10) {
  c = 100
} else {
  c = 1000
}
```

```assembly
p0 = a + b
p1 = p0 > 10

IF p1 else L0
c = 100
GOTO L1
L0:
c = 1000
L1:
...
```

```javascript
for (var i = 0; i < 10; i++) {
  sun += i
}
```

```assembly
i = 0
L0:
p0 = i < 10

IF p0 ELSE L1
sum = sum + i
i = i + 1
p0 = i < 10
GOTO L0

L1:
...
```

```javascript
func foo(a, b, c) {
  return x
}
foo(1, 2, 3)
```

```assembly
FOO:
RETURN x

PUSH 1
PUSH 2
PUSH 3
CALL FOO
```

### 语法制导定义（SDD）

语法制导定义（*Syntax Directed Definition，SDD*），定义 *AST* 如何被翻译。

*SDD* 通常包含

* 文法：上下文无关文法 *G*
* 规则：文法中的每条产生式
* 属性：定义每条产生式的如何计算

举个例子，四则运算的 *SDD*：

文法：

```
E -> E + T
	 | T
T -> T * F
   | F
F -> 0|1|2|3|4|5|6|7|8|9
```

规则及属性：

| 规则           | 属性                     |
| -------------- | ------------------------ |
| $E \to E' + T$ | $E.val = E'.val + T.val$ |
| $E \to T$      | $E.val = T.val$          |
| $T \to T' * F$ | $T.val = T'.val * F.val$ |
| $T \to F$      | $T.val = F.val$          |



| 规则           | 属性                                                         |
| -------------- | ------------------------------------------------------------ |
| $E \to E' + T$ | E.var = assign()<br />pro.add('var E.var = E'.var + T.var')  |
| $E \to T$      | E.var = assign()<br />program.add('var E.var = T.var')`      |
| $T \to T' * F$ | T.var = assign()<br />program.add('var T.var = T'.var * F.val) |
| $T \to F$      | T.var = assign()<br />program.add('var T.var = F.val')       |

*（assign() 表示在符号表中插入一个变量）*

### 词法作用域

一个符号的可见范围称为这个符号的**作用域**。

词法作用域的意思是符号的作用域和源代码的书写位置（词法）相关。

一个变量的变换过程

词法符号 -> ASTNode -> 三地址代码中的地址 -> 运行时环境的操作数

### 符号表（Symbol Table）

符号表用于存储符号 Symbol （常量、变量、标签）在源代码中的位置、数据类型，以及位置信息决定的词法作用域和运行时的相对内存地址。

#### 静态符号表

静态符号表用哈希表实现，存储常量在常量区的位置

#### 符号表

符号表用 树 + 哈希表 实现，存储每个符号的词法作用域，以及它在词法作用域的相对位置。

![](https://tva1.sinaimg.cn/large/008i3skNgy1gx5ilbumjnj30a3088mxc.jpg)





![](https://tva1.sinaimg.cn/large/008i3skNgy1gx5ilcb17lj30bb06cglo.jpg)





![](https://tva1.sinaimg.cn/large/008i3skNgy1gx5ilb8hfkj308m06rjrg.jpg)

