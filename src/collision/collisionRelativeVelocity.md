# 碰撞冲量和相对速度定义

在构建物理引擎时，碰撞响应（Collision Resolution）是最核心的模块之一。而碰撞响应的核心，就是求解**冲量标量 $j$**。本文将从第一性原理出发，一步步推导 $j$ 的公式，并深入探讨容易被忽视的**相对速度定义**及其对仿真稳定性的影响。

---

## 1. 问题的定义

假设有两个刚体 $A$ 和 $B$ 在世界空间发生碰撞。

- **碰撞点**：$\mathbf{P}$
- **碰撞法线**：$\mathbf{n}$（定义为从 $B$ 指向 $A$ 的单位向量）
- **质心到碰撞点的向量**：$\mathbf{r}_a = \mathbf{P} - \mathbf{C}_a$，$\mathbf{r}_b = \mathbf{P} - \mathbf{C}_b$
- **线速度与角速度**：$\mathbf{v}_a, \mathbf{\omega}_a$ 和 $\mathbf{v}_b, \mathbf{\omega}_b$

我们的目标是找到一个冲量标量 $j$，当它作用于碰撞点时，能够改变两个物体的速度，使得它们在碰撞后的相对速度符合**牛顿碰撞定律**。

---

## 2. 关键：相对速度的定义

相对速度的定义决定了后续所有公式的符号。为了与工业级引擎（如 Bullet, Box2D）保持一致，我们定义**碰撞点处的相对速度 $\mathbf{v}_{rel}$** 为：

$$ \mathbf{v}_{rel} = \mathbf{v}_{pa} - \mathbf{v}_{pb} $$

其中，碰撞点在物体上的速度公式为：
$$ \mathbf{v}_{pa} = \mathbf{v}_a + \mathbf{\omega}_a \times \mathbf{r}_a $$
$$ \mathbf{v}_{pb} = \mathbf{v}_b + \mathbf{\omega}_b \times \mathbf{r}_b $$

### 为什么这样定义？

当 $\mathbf{v}_{rel} \cdot \mathbf{n} < 0$ 时，意味着两个物体正在**相互靠近**（接近速度为负）；当 $\mathbf{v}_{rel} \cdot \mathbf{n} > 0$ 时，意味着物体正在**相互远离**。

---

## 3. 物理约束：牛顿碰撞定律

碰撞后的相对速度 $\mathbf{v}_{rel}^+$ 与碰撞前的相对速度 $\mathbf{v}_{rel}^-$ 满足以下关系：

$$ \mathbf{v}_{rel}^+ \cdot \mathbf{n} = -e (\mathbf{v}_{rel}^- \cdot \mathbf{n}) $$

其中 $e$ 是恢复系数（Restitution）。这是我们求解 $j$ 的唯一方程。

---

## 4. 冲量对速度的影响

根据冲量定理，施加冲量 $\mathbf{J} = j\mathbf{n}$ 后，物体的速度变化为：

**对于物体 A（受力方向为 $+\mathbf{n}$）：**
$$ \Delta \mathbf{v}_a = \frac{j\mathbf{n}}{m_a} $$
$$ \Delta \mathbf{\omega}_a = \mathbf{I}_a^{-1} (\mathbf{r}_a \times j\mathbf{n}) $$

**对于物体 B（受力方向为 $-\mathbf{n}$）：**
$$ \Delta \mathbf{v}_b = -\frac{j\mathbf{n}}{m_b} $$
$$ \Delta \mathbf{\omega}_b = \mathbf{I}_b^{-1} (\mathbf{r}_b \times -j\mathbf{n}) $$

---

## 5. 核心推导步骤

我们将碰撞后的相对速度展开：
$$ \mathbf{v}_{rel}^+ = (\mathbf{v}_a^+ + \mathbf{\omega}_a^+ \times \mathbf{r}_a) - (\mathbf{v}_b^+ + \mathbf{\omega}_b^+ \times \mathbf{r}_b) $$

代入速度变化公式 $\mathbf{v}^+ = \mathbf{v}^- + \Delta \mathbf{v}$：
$$ \mathbf{v}_{rel}^+ = \mathbf{v}_{rel}^- + \left( \frac{j\mathbf{n}}{m_a} + (\mathbf{I}_a^{-1}(\mathbf{r}_a \times j\mathbf{n})) \times \mathbf{r}_a \right) - \left( -\frac{j\mathbf{n}}{m_b} + (\mathbf{I}_b^{-1}(\mathbf{r}_b \times -j\mathbf{n})) \times \mathbf{r}_b \right) $$

提取公因子 $j$：
$$ \mathbf{v}_{rel}^+ = \mathbf{v}_{rel}^- + j \left[ \frac{1}{m_a} + \frac{1}{m_b} + (\mathbf{I}_a^{-1}(\mathbf{r}_a \times \mathbf{n})) \times \mathbf{r}_a + (\mathbf{I}_b^{-1}(\mathbf{r}_b \times \mathbf{n})) \times \mathbf{r}_b \right] $$

现在，两边同时点乘法线 $\mathbf{n}$，并利用牛顿碰撞定律 $\mathbf{v}_{rel}^+ \cdot \mathbf{n} = -e (\mathbf{v}_{rel}^- \cdot \mathbf{n})$：
$$ -e (\mathbf{v}_{rel}^- \cdot \mathbf{n}) = \mathbf{v}_{rel}^- \cdot \mathbf{n} + j \left[ \frac{1}{m_a} + \frac{1}{m_b} + ((\mathbf{I}_a^{-1}(\mathbf{r}_a \times \mathbf{n})) \times \mathbf{r}_a) \cdot \mathbf{n} + ((\mathbf{I}_b^{-1}(\mathbf{r}_b \times \mathbf{n})) \times \mathbf{r}_b) \cdot \mathbf{n} \right] $$

---

## 6. 最终公式

整理上式，求得 **$j$ 的标准公式**：

$$ j = \frac{-(1+e)(\mathbf{v}_{rel}^- \cdot \mathbf{n})}{\frac{1}{m_a} + \frac{1}{m_b} + [(\mathbf{I}_a^{-1}(\mathbf{r}_a \times \mathbf{n})) \times \mathbf{r}_a] \cdot \mathbf{n} + [(\mathbf{I}_b^{-1}(\mathbf{r}_b \times \mathbf{n})) \times \mathbf{r}_b] \cdot \mathbf{n}} $$

### 对比关于《Game Physics in One Weekend》

在《Game Physics in One Weekend》的代码实现中，你会发现分子没有负号。这是因为该书将法线定义为“从 A 指向 B”，且在应用冲量时手动反转了符号。
**建议**：在实际工程中，务必采用上述标准推导。标准推导保证了只要物体在靠近（点积为负），算出的 $j$ 就一定是正数，这符合物理直觉，也方便后续处理摩擦力不等式约束。
