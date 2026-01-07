import { LessonViewer } from "../components/LessonViewer";

// Sample lesson data
const SAMPLE_LESSON_DATA = [
  {
    unitTitle: "Unit 1: Kinematics",
    unitDescription: "Explore the fundamentals of motion by analyzing and applying multiple representations such as words, diagrams, graphs, and equations. Develop an understanding of objects moving with constant acceleration and common misconceptions about motion.",
    lessons: [
      {
        sectionId: "1.1",
        title: "Scalars and Vectors in One Dimension",
        lessonContent: {
          introduction: "Motion is the change in position of an object over time. However, to describe this change accurately, we must agree on specific language and mathematical tools. This lesson introduces the two fundamental types of physical quantities—scalars and vectors—and applies them to the basic parameters of motion: position, displacement, speed, and velocity. We will also explore the importance of reference frames, realizing that all motion is relative.",
          coreConcepts: [
            {
              conceptTitle: "Scalars vs. Vectors",
              explanation: "In physics, quantities are categorized based on the information they provide. A **scalar** is a quantity that is fully described by a magnitude (a number and a unit) alone. It answers 'how much'. Examples include mass, temperature, time, and distance. A **vector**, on the other hand, requires both a magnitude and a direction to be fully defined. Vectors answer 'how much' and 'which way'. \n\nMathematically, vectors are often denoted with an arrow above the symbol, such as $\\vec{v}$, or bold type. In one dimension (1D), direction is simply indicated by a positive or negative sign (+ or -). For example, if East is positive, a displacement of -5 meters means 5 meters West. A common misconception is treating negative vectors as having 'less' value than positive ones; the negative sign indicates direction, not a value less than zero.",
              example: "Temperature (25°C) is a scalar because it has no direction. Force (10 Newtons downwards) is a vector because the direction is crucial to the physical outcome.",
              diagramDescription: "A diagram comparing a thermometer (scalar) to an arrow pushing a box (vector). The arrow includes a label indicating magnitude and points to the right to indicate direction."
            },
            {
              conceptTitle: "Distance vs. Displacement",
              explanation: "These two terms are often used interchangeably in everyday language but have distinct meanings in physics. **Distance** ($d$) is a scalar quantity referring to 'how much ground an object has covered' during its motion. It is always positive. **Displacement** ($\\Delta x$) is a vector quantity that refers to 'how far out of place an object is'; it is the object's overall change in position. \n\nThe formula for displacement in 1D is: $$\\Delta x = x_f - x_i$$ where $x_f$ is the final position and $x_i$ is the initial position. Displacement can be zero even if the distance traveled is large (e.g., a round trip).",
              example: "Imagine walking 4 meters East, then 3 meters West. The total distance traveled is $4 + 3 = 7$ meters. However, your displacement is $4 - 3 = +1$ meter (1 meter East of the start).",
              diagramDescription: "A number line showing a path from 0 to 4, then looping back to 1. A dashed curved line represents the total path (distance), while a solid straight arrow pointing from 0 to 1 represents the displacement vector."
            },
            {
              conceptTitle: "Speed vs. Velocity",
              explanation: "Just as distance differs from displacement, speed differs from velocity. **Average Speed** is a scalar defined as the total distance traveled divided by the total time elapsed. It ignores direction. $$\\text{Avg Speed} = \\frac{d_{total}}{\\Delta t}$$ **Average Velocity** is a vector defined as the total displacement divided by the time elapsed. $$\\vec{v}_{avg} = \\frac{\\Delta x}{\\Delta t} = \\frac{x_f - x_i}{t_f - t_i}$$ Velocity indicates the rate at which position changes. If you return to your starting point, your average velocity is zero because your displacement is zero, regardless of how fast you ran.",
              example: "A swimmer completes a 50m lap in a pool and returns to the start in 100 seconds total. Distance = 100m, so Avg Speed = 100m/100s = 1 m/s. Displacement = 0m, so Avg Velocity = 0 m/s.",
              diagramDescription: "Comparison of a speedometer (reading only magnitude) vs. a GPS navigation arrow (showing speed and heading direction)."
            }
          ],
          summary: [
            "Scalars have magnitude only; vectors have magnitude and direction.",
            "Distance is the total path length (scalar); Displacement is the change in position (vector).",
            "Average velocity depends on displacement, not total distance.",
            "In 1D, signs (+/-) indicate vector direction.",
            "Motion is defined relative to a reference frame."
          ],
          quickCheckQuestions: [
            {
              question: "If you run around a circular track and finish where you started, is your displacement zero?",
              answer: "Yes, because the final position equals the initial position."
            },
            {
              question: "Can distance ever be negative?",
              answer: "No, distance is a scalar magnitude and is always non-negative."
            },
            {
              question: "A car travels at -20 m/s. What does the negative sign imply?",
              answer: "It implies the car is moving in the negative direction (e.g., West or Left) relative to the chosen coordinate system."
            }
          ]
        }
      },
      {
        sectionId: "1.2",
        title: "Visual Representations of Motion",
        lessonContent: {
          introduction: "Graphs are powerful tools in physics because they visually represent how physical quantities change relative to one another. By analyzing the shape, slope, and area of kinematic graphs, we can determine an object's past, present, and future motion without needing complex calculations immediately. This lesson focuses on Position-Time, Velocity-Time, and Acceleration-Time graphs.",
          coreConcepts: [
            {
              conceptTitle: "Position-Time Graphs (x-t)",
              explanation: "A position-time graph plots position ($x$) on the vertical axis and time ($t$) on the horizontal axis. The most critical feature of this graph is its **slope**. The slope of a tangent line to the curve represents the instantaneous **velocity**. $$\\text{Slope} = \\frac{\\Delta x}{\\Delta t} = v$$ - A straight diagonal line indicates constant velocity.\n- A horizontal line indicates the object is at rest (velocity = 0).\n- A curved line indicates changing velocity (acceleration). If the curve gets steeper, the object is speeding up.\n- A negative slope means moving in the negative direction.",
              example: "A graph showing a straight line rising from 0 to 10 meters over 5 seconds represents a constant velocity of $2\\text{ m/s}$.",
              diagramDescription: "An x-t graph with three segments: A positive slope (moving forward), a horizontal section (stopped), and a negative slope returning to zero (moving backward)."
            },
            {
              conceptTitle: "Velocity-Time Graphs (v-t)",
              explanation: "In a velocity-time graph, velocity is on the vertical axis. This graph is dense with information:\n1. The **slope** represents **acceleration** ($a = \\Delta v / \\Delta t$).\n2. The **area under the curve** (between the line and the time axis) represents **displacement** ($\\Delta x$).\n\nIf the line is above the t-axis, the object is moving in the positive direction. If below, it moves in the negative direction. Crossing the t-axis means the object has stopped momentarily and reversed direction.",
              example: "A car accelerates from 0 to 20 m/s in 10s. The v-t graph is a straight line from (0,0) to (10,20). The slope is $2\\text{ m/s}^2$. The area is a triangle: $0.5 \\cdot 10 \\cdot 20 = 100\\text{ m}$, which is the displacement.",
              diagramDescription: "A v-t graph showing a positive constant slope. The area under the line is shaded to illustrate displacement."
            },
            {
              conceptTitle: "Acceleration-Time Graphs (a-t)",
              explanation: "This graph plots acceleration vs. time. For the scope of basic kinematics, we mostly deal with constant acceleration, which appears as a horizontal line. The **area under the curve** of an a-t graph represents the **change in velocity** ($\\Delta v$). $$\\Delta v = \\text{Area}_{a-t}$$ It is important to note that an a-t graph cannot tell you the initial velocity or position; it only tells you how the velocity is changing.",
              example: "An object in free fall has a constant acceleration of $-9.8\\text{ m/s}^2$. The a-t graph is a horizontal line at $y = -9.8$.",
              diagramDescription: "An a-t graph with a flat horizontal line above the axis (positive acceleration) and then stepping down to a negative value."
            }
          ],
          summary: [
            "Slope of x-t graph = Velocity.",
            "Slope of v-t graph = Acceleration.",
            "Area under v-t graph = Displacement.",
            "Area under a-t graph = Change in Velocity.",
            "Curved x-t lines imply acceleration; straight x-t lines imply constant velocity."
          ],
          quickCheckQuestions: [
            {
              question: "What does a horizontal line on a velocity-time graph indicate?",
              answer: "Constant velocity (zero acceleration)."
            },
            {
              question: "If the velocity-time graph crosses the x-axis, what happened to the object?",
              answer: "It slowed down to a stop and changed direction."
            },
            {
              question: "Can you determine the starting position from a velocity-time graph alone?",
              answer: "No, you can only find the displacement (change in position)."
            }
          ]
        }
      },
      {
        sectionId: "1.3",
        title: "Mathematical Models of Motion",
        lessonContent: {
          introduction: "While graphs provide a qualitative overview, engineers and physicists need precise values. We use mathematical models to predict exactly where an object will be or how fast it will be going at a specific time. This lesson derives and applies the 'Big Four' kinematic equations which describe motion under **constant acceleration**.",
          coreConcepts: [
            {
              conceptTitle: "The Conditions for Kinematics",
              explanation: "The equations we are about to use obey a strict condition: **acceleration must be constant**. If acceleration changes (like a car jerking back and forth), these specific equations cannot be used directly over the whole time interval. Fortunately, gravity ($g$) is constant near Earth's surface, making these equations perfect for free-fall problems.",
              example: "A rock dropped from a bridge undergoes constant acceleration due to gravity. A car driving in stop-and-go traffic does not.",
              diagramDescription: "A checklist graphic with 'Constant Acceleration' checked and 'Variable Jerk' crossed out."
            },
            {
              conceptTitle: "The Big Four Kinematic Equations",
              explanation: "These equations relate five variables: displacement ($\\Delta x$), initial velocity ($v_i$), final velocity ($v_f$), acceleration ($a$), and time ($t$).\n\n1. **Velocity-Time:** $v_f = v_i + at$ (Derived from the definition of acceleration).\n\n2. **Displacement-Time:** $\\Delta x = v_i t + \\frac{1}{2}at^2$ (Derived from the area under a v-t graph).\n\n3. **Velocity-Displacement:** $v_f^2 = v_i^2 + 2a\\Delta x$ (Useful when time $t$ is not known).\n\n4. **Average Velocity:** $\\Delta x = \\frac{v_i + v_f}{2} t$ (Displacement equals average velocity times time).\n\nTo solve problems, identify the three known variables and the one unknown, then select the equation that contains those four symbols.",
              example: "A car starts from rest ($v_i = 0$) and accelerates at $3\\text{ m/s}^2$ for $5\\text{ s}$. Finding displacement: Use eq 2. $\\Delta x = 0(5) + 0.5(3)(5^2) = 37.5\\text{ m}$.",
              diagramDescription: "A reference table listing the four equations and identifying which variable is 'missing' from each equation to aid selection."
            },
            {
              conceptTitle: "Linearization",
              explanation: "In experimental physics, we often want to verify relationships using straight-line graphs ($y = mx + b$). If we suspect $\\Delta x = \\frac{1}{2}at^2$ (where $v_i=0$), plotting $x$ vs. $t$ gives a curve (parabola). To 'linearize' this, we plot $x$ vs. $t^2$. If the model is correct, this graph will be a straight line passing through the origin, and the slope will equal $\\frac{1}{2}a$. This technique allows us to determine acceleration experimentally.",
              example: "Dropping a ball from various heights and timing the fall. Plotting Height vs. Time squared yields a straight line with slope $4.9$ (approx $g/2$).",
              diagramDescription: "Side-by-side graphs: The left shows a curve (x vs t), the right shows a straight line (x vs t^2) derived from the same data."
            }
          ],
          summary: [
            "Kinematic equations only apply to constant acceleration.",
            "Identify knowns and unknowns to pick the right equation.",
            "The symbol $g$ is approx $9.8\\text{ m/s}^2$ (or $10\\text{ m/s}^2$) acting downwards.",
            "Linearization transforms curved data into a straight line to extract physical constants."
          ],
          quickCheckQuestions: [
            {
              question: "Which variable is missing from the equation $v_f = v_i + at$?",
              answer: "Displacement ($\\Delta x$)."
            },
            {
              question: "If an object is dropped, what are $v_i$ and $a$?",
              answer: "$v_i = 0\\text{ m/s}$ and $a = -g$ (approx $-9.8\\text{ m/s}^2$)."
            },
            {
              question: "How do you find acceleration from a $x$ vs $t^2$ graph?",
              answer: "Calculate the slope and multiply by 2 (since Slope = $\\frac{1}{2}a$)."
            }
          ]
        }
      },
      {
        sectionId: "1.4",
        title: "Motion in Two Dimensions",
        lessonContent: {
          introduction: "Real-world motion is rarely confined to a straight line. Basketballs, rockets, and cars on curves move in two dimensions. This lesson extends our 1D tools to 2D by using the independence of vectors. The key insight is that horizontal and vertical motions are completely independent of each other but occur simultaneously.",
          coreConcepts: [
            {
              conceptTitle: "Vector Decomposition and Components",
              explanation: "Any diagonal velocity vector $\\vec{v}$ can be broken down into two perpendicular parts: an x-component ($v_x$) and a y-component ($v_y$). We use trigonometry for this: $$v_x = v \\cos(\\theta)$$ $$v_y = v \\sin(\\theta)$$ where $\\theta$ is the angle measured from the horizontal. Conversely, if we know the components, we can find the total magnitude using the Pythagorean theorem: $v = \\sqrt{v_x^2 + v_y^2}$ and the direction using $\\theta = \\tan^{-1}(v_y/v_x)$.",
              example: "A cannonball is fired at $50\\text{ m/s}$ at $30^\\circ$. $v_x = 50 \\cos(30) \\approx 43.3\\text{ m/s}$, $v_y = 50 \\sin(30) = 25\\text{ m/s}$.",
              diagramDescription: "A right triangle formed by a velocity vector (hypotenuse) and its horizontal and vertical components."
            },
            {
              conceptTitle: "Projectile Motion Logic",
              explanation: "Projectile motion is the study of an object moving through the air subject only to gravity (ignoring air resistance). The 'Golden Rule' of projectile motion is: **Motion in the x-direction is independent of motion in the y-direction.**\n\n- **Horizontal (x):** There are no forces acting horizontally (gravity is vertical). Therefore, acceleration $a_x = 0$. The object moves at constant velocity: $x = v_{x} t$.\n- **Vertical (y):** Gravity acts downwards. Acceleration $a_y = -g$. The object is in free fall: $y = y_i + v_{yi}t - \\frac{1}{2}gt^2$.\n\nThe two dimensions are linked only by **time** ($t$). The projectile hits the ground at the same time in both the x and y calculations.",
              example: "A bullet dropped from hand height hits the ground at the exact same time as a bullet fired horizontally from a gun at the same height. The fired bullet travels further horizontally, but their vertical fall rates are identical.",
              diagramDescription: "Stroboscopic diagram showing two balls falling: one dropped straight down, one launched horizontally. Horizontal lines connect their positions at equal time intervals, showing they fall at the same rate."
            },
            {
              conceptTitle: "Solving Projectile Problems",
              explanation: "To solve 2D problems, create two columns: X-data and Y-data.\n1. Resolve initial velocity into $v_{ix}$ and $v_{iy}$.\n2. In the X-column, use $x = v_x t$.\n3. In the Y-column, use kinematic equations with $a = -9.8\\text{ m/s}^2$.\n4. Solve for time in one dimension and plug it into the other.",
              example: "A ball rolls off a 20m high cliff at 10m/s. \nY-axis (find time to fall): $\\Delta y = -20$, $v_{iy}=0$, $a=-9.8$. $-20 = 0 - 4.9t^2 \\Rightarrow t \\approx 2.02\\text{ s}$.\nX-axis (find range): $x = v_x t = 10(2.02) = 20.2\\text{ m}$.",
              diagramDescription: "A T-chart labeled 'Horizontal' and 'Vertical' organizing variables, with an arrow labeled 'Time' connecting the two columns."
            }
          ],
          summary: [
            "X and Y motion are independent.",
            "Horizontal velocity is constant (if no air resistance).",
            "Vertical motion is constant acceleration (gravity).",
            "Time is the common variable connecting X and Y.",
            "At the top of a trajectory, vertical velocity is zero, but horizontal velocity is not."
          ],
          quickCheckQuestions: [
            {
              question: "What is the acceleration of a projectile at the very top of its path?",
              answer: "$9.8\\text{ m/s}^2$ downwards (gravity never turns off)."
            },
            {
              question: "Does horizontal velocity change during projectile motion (ignoring air resistance)?",
              answer: "No, because there is no horizontal force/acceleration."
            },
            {
              question: "If you launch a projectile at a steeper angle, does it stay in the air longer?",
              answer: "Yes, a larger vertical component results in a longer flight time."
            }
          ]
        }
      }
    ]
  }
];

export const LessonViewerPage = () => {
  return (
    <div>
      <LessonViewer book={SAMPLE_LESSON_DATA} />
    </div>
  );
};
