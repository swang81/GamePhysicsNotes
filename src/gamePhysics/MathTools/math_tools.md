# 数学工具

## 向量

向量是物理引擎中最基本的数据结构，用于表示具有大小和方向的物理量，如位置、速度和力。一个三维向量通常表示为 $v= (v_x, v_y, v_z)$。

核心的向量运算包括：

**点积**在物理引擎中的常见应用包括：计算两个向量之间的夹角、判断两个向量是否正交（点积为零）、计算一个向量在某方向上的分量。
$$\mathbf{a} \cdot \mathbf{b} = a_x b_x + a_y b_y + a_z b_z = |\mathbf{a}| |\mathbf{b}| \cos(\theta)$$

**叉积**很多地方会使用，例如$\boldsymbol{\tau} = \mathbf{r} \times \mathbf{F}$和角动量$\mathbf{L} =\mathbf{r} \times \mathbf{p}$等物理量时至关重要。

$$
\mathbf{a} \times \mathbf{b} = \begin{pmatrix} a_y b_z - a_z b_y \\ a_z b_x - a_x b_z \\ a_x b_y - a_y b_x \end{pmatrix}
$$

## 3x3旋转矩阵
3x3矩阵主要用于表示旋转和惯性张量。一个绕任意轴$\mathbf{n}= (n_x, n_y, n_z)$旋转角度$\theta$的旋转矩阵，可以用罗德里格斯公式（Rodrigues' Rotation Formula）表示：

$$\mathbf{R} = \mathbf{I} + \sin(\theta)[\mathbf{n}]_\times + (1 - \cos(\theta))[\mathbf{n}]_\times^2$$

其中$[\mathbf{n}]_\times$是向量$\mathbf{n}$的反对称矩阵（Skew-Symmetric Matrix）：

$$
[\mathbf{n}]_\times = \begin{pmatrix} 0 & -n_z & n_y \\ n_z & 0 & -n_x \\ -n_y & n_x & 0 \end{pmatrix}
$$

旋转矩阵具有正交性，即$\mathbf{R^T}\mathbf{R} = \mathbf{I}$，且行列式为1。

## 4x4变换矩阵
4x4矩阵用于表示一个完整的仿射变换，包含旋转和平移。其一般形式为：

$$\mathbf{T} = \begin{pmatrix} \mathbf{R} & \mathbf{t} \\ \mathbf{0}^T & 1 \end{pmatrix} = \begin{pmatrix} r_{11} & r_{12} & r_{13} & t_x \\ r_{21} & r_{22} & r_{23} & t_y \\ r_{31} & r_{32} & r_{33} & t_z \\ 0 & 0 & 0 & 1 \end{pmatrix}$$

其中$\mathbf{R}$是3x3旋转矩阵，$\mathbf{t}$是平移向量。这种矩阵在与图形API（如OpenGL或Direct3D）交互时尤其有用，因为它可以直接传递给着色器来变换顶点。

## 四元数(Quaternions)

虽然旋转矩阵可以表示旋转，但在实际应用中，直接使用矩阵进行旋转插值或连续旋转累加会遇到问题，例如**万向锁（Gimbal Lock）**。四元数$\mathbf{q}$，提供了一种更优雅、更高效的旋转表示方法。

一个四元数可以写为
$$
\mathbf{q} = w + xi + yj + zk
$$

或简写为
$$
\mathbf{q} = (w,x,y,z) =(w, \mathbf{v})
$$ 
其中$w$是标量部分，$\mathbf{v}= (x, y, z)$是向量部分。

一个绕单位轴$\mathbf{n}$旋转角度$\theta$的旋转可以用单位四元数表示为：
$$\mathbf{q} = \left( \cos\frac{\theta}{2}, \sin\frac{\theta}{2} \cdot \mathbf{n} \right) = \left( \cos\frac{\theta}{2}, \sin\frac{\theta}{2} n_x, \sin\frac{\theta}{2} n_y, \sin\frac{\theta}{2} n_z \right)$$

使用四元数旋转一个向量$\mathbf{v}$的公式为：
$$
\mathbf{v}' = \mathbf{q} \mathbf{v} \mathbf{q}^{-1}
$$

其中$\mathbf{v}$被视为纯四元数$(0,\mathbf{v})$，$\mathbf{q}^{-1}$是$\mathbf{q}$的逆。对于单位四元数，其逆等于共轭$\mathbf{q}^*= (w, -\mathbf{v})$。

## 惯性张量


对于点质量，惯性由标量质量$m$描述。但对于具有体积和形状的刚体（Rigid Body），其对旋转运动的“阻力”不仅取决于质量，还取决于质量如何围绕旋转轴分布。这种分布特性由一个3x3的对称矩阵——惯性张量$\mathbf{I}$来描述。

惯性张量的一般形式为：

$$
\mathbf{I} = \begin{pmatrix} I_{xx} & -I_{xy} & -I_{xz} \\ -I_{xy} & I_{yy} & -I_{yz} \\ -I_{xz} & -I_{yz} & I_{zz} \end{pmatrix}
$$

其中对角线元素是转动惯量（Moments of Inertia），非对角线元素是**惯性积（Products of Inertia）**。对于连续质量分布，这些元素的定义为：

$$I_{xx} = \int (y^2 + z^2) \, dm, \quad I_{yy} = \int (x^2 + z^2) \, dm, \quad I_{zz} = \int (x^2 + y^2) \, dm$$

$$I_{xy} = \int xy \, dm, \quad I_{xz} = \int xz \, dm, \quad I_{yz} = \int yz \, dm$$

惯性张量建立了角动量（$\mathbf{L}$）和角速度（$\mathbf{\omega}$）之间的线性关系：

$$\mathbf{L} = \mathbf{I} \boldsymbol{\omega}$$

它也出现在旋转动力学的牛顿第二定律的旋转版本中（欧拉方程）：

$$\boldsymbol{\tau} = \frac{d\mathbf{L}}{dt} = \mathbf{I} \boldsymbol{\alpha} + \boldsymbol{\omega} \times (\mathbf{I} \boldsymbol{\omega})$$

在物体的主轴（Principal Axes）坐标系下，惯性张量可以简化为一个对角矩阵：

$$\mathbf{I}_{principal} = \begin{pmatrix} I_1 & 0 & 0 \\ 0 & I_2 & 0 \\ 0 & 0 & I_3 \end{pmatrix}$$

其中 $I_1$, $I_2$, $I_3$ 是主转动惯量。计算和正确使用惯性张量是实现逼真刚体旋转动力学的关键。物理引擎通常会提供自动计算常见几何形状（如球体、长方体、圆柱体）惯性张量的功能。


