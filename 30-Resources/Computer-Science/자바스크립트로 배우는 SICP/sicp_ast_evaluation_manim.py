from manim import *

class ASTEvaluation(Scene):
    def construct(self):
        # 폰트 설정 (Mac 환경의 경우 맑은 고딕이나 AppleGothic 등 지원되는 폰트 사용)
        font_name = "AppleGothic"

        title = Text("ABSTRACT SYNTAX TREE", font=font_name, font_size=24, color=LIGHT_GREY)
        title.to_edge(UP, buff=0.5)
        
        # 2. 표현식 (수식)
        expr = MathTex(
            r"(", 
            r"2", r"+", r"4", r"\times", r"6", 
            r")", 
            r"\times", 
            r"(", 
            r"3", r"+", r"12", 
            r");",
            font_size=48
        )
        
        # 색상 매핑 (이미지와 비슷한 테마)
        TEAL_COLOR = "#4cd9b0"
        YELLOW_COLOR = "#f2c94c"
        RED_COLOR = "#eb5b5b"
        PURPLE_COLOR = "#a084eb"

        expr[1].set_color(TEAL_COLOR) # 2
        expr[2].set_color(YELLOW_COLOR) # +
        expr[3].set_color(TEAL_COLOR) # 4
        expr[4].set_color(RED_COLOR) # *
        expr[5].set_color(TEAL_COLOR) # 6
        
        expr[7].set_color(PURPLE_COLOR) # * (root)
        
        expr[9].set_color(TEAL_COLOR) # 3
        expr[10].set_color(YELLOW_COLOR) # +
        expr[11].set_color(TEAL_COLOR) # 12
        
        expr_box = SurroundingRectangle(expr, corner_radius=0.15, color=DARK_GRAY, buff=0.3, stroke_width=2)
        expr_group = VGroup(expr_box, expr).next_to(title, DOWN, buff=0.4)
        
        self.play(Write(title))
        self.play(FadeIn(expr_group))
        self.wait(1)

        # 3. 트리 노드 생성 헬퍼 함수
        NODE_RADIUS = 0.35
        LEAF_WIDTH = 0.8
        LEAF_HEIGHT = 0.6
        
        def create_op_node(text, color):
            circle = Circle(radius=NODE_RADIUS, color=color, fill_opacity=0.1, stroke_width=3)
            label = Text(text, color=color, font_size=28, weight=BOLD)
            return VGroup(circle, label)
            
        def create_leaf_node(text, color=TEAL_COLOR):
            rect = RoundedRectangle(corner_radius=0.15, width=LEAF_WIDTH, height=LEAF_HEIGHT, color=color, fill_opacity=0.1, stroke_width=3)
            label = Text(text, color=color, font_size=28)
            return VGroup(rect, label)
            
        # 노드 배치
        root = create_op_node("×", PURPLE_COLOR).move_to(DOWN * 0.2)
        
        left_add = create_op_node("+", YELLOW_COLOR).move_to(root.get_center() + LEFT * 2.5 + DOWN * 1.5)
        right_add = create_op_node("+", YELLOW_COLOR).move_to(root.get_center() + RIGHT * 2.5 + DOWN * 1.5)
        
        leaf_2 = create_leaf_node("2").move_to(left_add.get_center() + LEFT * 1.5 + DOWN * 1.6)
        left_mul = create_op_node("×", RED_COLOR).move_to(left_add.get_center() + RIGHT * 1.5 + DOWN * 1.6)
        
        leaf_3 = create_leaf_node("3").move_to(right_add.get_center() + LEFT * 1.2 + DOWN * 1.6)
        leaf_12 = create_leaf_node("12").move_to(right_add.get_center() + RIGHT * 1.2 + DOWN * 1.6)
        
        leaf_4 = create_leaf_node("4").move_to(left_mul.get_center() + LEFT * 1.0 + DOWN * 1.6)
        leaf_6 = create_leaf_node("6").move_to(left_mul.get_center() + RIGHT * 1.0 + DOWN * 1.6)
        
        # 엣지 연결 헬퍼 함수
        def connect(n1, n2, color=DARK_GRAY):
            return Line(n1[0].get_bottom(), n2[0].get_top(), color=color, stroke_width=2).set_z_index(-1)
            
        edge_root_L = connect(root, left_add, PURPLE_COLOR)
        edge_root_R = connect(root, right_add, PURPLE_COLOR)
        
        edge_Ladd_2 = connect(left_add, leaf_2, YELLOW_COLOR)
        edge_Ladd_Lmul = connect(left_add, left_mul, YELLOW_COLOR)
        
        edge_Radd_3 = connect(right_add, leaf_3, YELLOW_COLOR)
        edge_Radd_12 = connect(right_add, leaf_12, YELLOW_COLOR)
        
        edge_Lmul_4 = connect(left_mul, leaf_4, RED_COLOR)
        edge_Lmul_6 = connect(left_mul, leaf_6, RED_COLOR)
        
        edges = VGroup(
            edge_root_L, edge_root_R, 
            edge_Ladd_2, edge_Ladd_Lmul, 
            edge_Radd_3, edge_Radd_12, 
            edge_Lmul_4, edge_Lmul_6
        )
        
        nodes = VGroup(
            root, left_add, right_add, 
            leaf_2, left_mul, leaf_3, leaf_12, 
            leaf_4, leaf_6
        )
        
        tree_group = VGroup(edges, nodes)
        tree_group.shift(UP * 1.0) # 위치 조정
        
        # 트리 그리기 애니메이션 (위에서 아래로)
        self.play(FadeIn(root, shift=DOWN))
        self.wait(0.3)
        self.play(
            Create(edge_root_L), Create(edge_root_R),
            FadeIn(left_add, shift=DOWN), FadeIn(right_add, shift=DOWN)
        )
        self.wait(0.3)
        self.play(
            Create(edge_Ladd_2), Create(edge_Ladd_Lmul),
            Create(edge_Radd_3), Create(edge_Radd_12),
            FadeIn(leaf_2, shift=DOWN), FadeIn(left_mul, shift=DOWN), 
            FadeIn(leaf_3, shift=DOWN), FadeIn(leaf_12, shift=DOWN)
        )
        self.wait(0.3)
        self.play(
            Create(edge_Lmul_4), Create(edge_Lmul_6),
            FadeIn(leaf_4, shift=DOWN), FadeIn(leaf_6, shift=DOWN)
        )
        self.wait(1.5)

        # 현재 평가 단계를 표시할 텍스트박스
        step_text = Text("", font=font_name, font_size=24, color=WHITE)
        step_text.to_edge(DOWN, buff=1)
        self.add(step_text)
        
        # 단말 노드(Leaf)들을 위로 쏘아올려(축약) 연산하는 애니메이션 헬퍼
        def evaluate_node(op_node, leaf1, leaf2, edge1, edge2, result_val, color, desc_text):
            # 설명 텍스트 업데이트
            new_step_text = Text(desc_text, font=font_name, font_size=24, color=WHITE).to_edge(DOWN, buff=1)
            self.play(Transform(step_text, new_step_text), run_time=0.5)

            # 강조
            self.play(Indicate(leaf1, scale_factor=1.2, color=color), Indicate(leaf2, scale_factor=1.2, color=color))
            
            # 연산 결과 노드 생성
            new_node = create_leaf_node(str(result_val), color=color).move_to(op_node.get_center())
            
            # 자식 노드와 간선, 부모 연산자 노드를 모두 하나의 결과 노드로 병합 (축약/Reduction)
            self.play(
                ReplacementTransform(VGroup(leaf1, leaf2, op_node, edge1, edge2), new_node),
                run_time=1.2
            )
            self.wait(1)
            return new_node
            
        # 평가 단계 (Bottom-Up)
        
        # 1. 오른쪽 자식부터 할 수도 있고 왼쪽 자식부터 할 수도 있습니다. 
        # 자바스크립트는 일반적으로 좌에서 우로 평가하므로:
        # Step 1: 4 * 6
        res_24 = evaluate_node(left_mul, leaf_4, leaf_6, edge_Lmul_4, edge_Lmul_6, 24, RED_COLOR, "1단계: (4 × 6) 트리의 가장 깊은 곳부터 평가합니다.")
        
        # Step 2: 2 + 24
        res_26 = evaluate_node(left_add, leaf_2, res_24, edge_Ladd_2, edge_Ladd_Lmul, 26, YELLOW_COLOR, "2단계: (2 + 24) 평가된 결과를 이용해 한 단계 위로 올라갑니다.")
        
        # Step 3: 3 + 12
        res_15 = evaluate_node(right_add, leaf_3, leaf_12, edge_Radd_3, edge_Radd_12, 15, YELLOW_COLOR, "3단계: (3 + 12) 다른 쪽 가지의 피연산자를 평가합니다.")
        
        # Step 4: 26 * 15
        res_390 = evaluate_node(root, res_26, res_15, edge_root_L, edge_root_R, 390, PURPLE_COLOR, "4단계: (26 × 15) 마지막으로 루트 연산자인 곱셈을 수행합니다.")
        
        # 최종 결과 강조 및 수식 업데이트
        final_desc = Text("최종 결과: 390", font=font_name, font_size=28, color=PURPLE_COLOR, weight=BOLD).to_edge(DOWN, buff=1)
        self.play(Transform(step_text, final_desc))

        box = SurroundingRectangle(res_390, color=WHITE, buff=0.15)
        self.play(Create(box))
        
        # 상단 수식을 390으로 변환
        final_expr = MathTex("390", font_size=60, color=PURPLE_COLOR).move_to(expr.get_center())
        self.play(ReplacementTransform(expr_group, final_expr))
        
        self.wait(3)

        self.play(FadeOut(Group(*self.mobjects)))
