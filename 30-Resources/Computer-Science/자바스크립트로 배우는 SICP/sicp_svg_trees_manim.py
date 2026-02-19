from manim import *

class ExpansionTreeSVG(Scene):
    def construct(self):
        font_name = "AppleGothic"

        # 타이틀
        title = Text("전개 트리 (Expansion)", font=font_name, font_size=32, color=BLUE)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title))

        # Node 1 (Layer 1)
        node1 = MathTex(r"\text{sum\_of\_squares}(5 + 1, 5 \times 2)")
        node1.move_to(UP * 1.5)

        # Node 2 (Layer 2)
        node2_L = MathTex(r"\text{square}(5 + 1)", color=TEAL)
        node2_plus = MathTex("+")
        # 원본 데이터에 있던 오타 square(5 + 2) 를 square(5 * 2)로 수정 반영했습니다.
        node2_R = MathTex(r"\text{square}(5 \times 2)", color=TEAL)
        
        node2_group = VGroup(node2_L, node2_plus, node2_R).arrange(RIGHT, buff=0.8)
        node2_group.move_to(ORIGIN)

        # Node 3 (Layer 3)
        node3_L = MathTex(r"(5 + 1) \times (5 + 1)", color=YELLOW)
        node3_plus = MathTex("+")
        node3_R = MathTex(r"(5 \times 2) \times (5 \times 2)", color=YELLOW)
        
        node3_group = VGroup(node3_L, node3_plus, node3_R).arrange(RIGHT, buff=0.5)
        node3_group.move_to(DOWN * 1.5)

        # 화살표
        arrow1_L = Arrow(node1.get_bottom(), node2_L.get_top(), buff=0.1, color=LIGHT_GREY)
        arrow1_R = Arrow(node1.get_bottom(), node2_R.get_top(), buff=0.1, color=LIGHT_GREY)

        arrow2_L = Arrow(node2_L.get_bottom(), node3_L.get_top(), buff=0.1, color=LIGHT_GREY)
        arrow2_R = Arrow(node2_R.get_bottom(), node3_R.get_top(), buff=0.1, color=LIGHT_GREY)

        # ---------------- 애니메이션 시퀀스 ----------------
        self.play(FadeIn(node1, shift=DOWN))
        self.wait(1)

        # 분산(Expansion)되는 느낌을 살리기 위해 copy()가 변형됨
        self.play(
            GrowArrow(arrow1_L), GrowArrow(arrow1_R),
            ReplacementTransform(node1.copy(), node2_L),
            ReplacementTransform(node1.copy(), node2_R),
        )
        self.play(Write(node2_plus))
        self.wait(1)

        self.play(
            GrowArrow(arrow2_L), GrowArrow(arrow2_R),
            ReplacementTransform(node2_L.copy(), node3_L),
            ReplacementTransform(node2_R.copy(), node3_R),
        )
        self.play(Write(node3_plus))
        self.wait(2)
        self.play(FadeOut(Group(*self.mobjects)))


class ReductionTreeSVG(Scene):
    def construct(self):
        font_name = "AppleGothic"

        # 타이틀
        title = Text("축약 트리 (Reduction)", font=font_name, font_size=32, color=GREEN)
        title.to_edge(UP, buff=0.5)
        self.play(Write(title))

        # Node 1 (Layer 1)
        node1_L = MathTex(r"6 \times 6", color=YELLOW)
        node1_plus = MathTex("+")
        node1_R = MathTex(r"10 \times 10", color=YELLOW)
        
        node1_group = VGroup(node1_L, node1_plus, node1_R).arrange(RIGHT, buff=1.0)
        node1_group.move_to(UP * 1.5)

        # Node 2 (Layer 2)
        node2_L = MathTex(r"36", color=TEAL)
        node2_plus = MathTex("+")
        # 원본 데이터에 있던 오타 36+36 을 36+100으로 수정 반영했습니다.
        node2_R = MathTex(r"100", color=TEAL)
        
        node2_group = VGroup(node2_L, node2_plus, node2_R).arrange(RIGHT, buff=1.5)
        node2_group.move_to(ORIGIN)

        # Node 3 (Layer 3)
        node3 = MathTex(r"136", fill_color=WHITE, font_size=60)
        node3.move_to(DOWN * 1.5)

        # 화살표
        arrow1_L = Arrow(node1_L.get_bottom(), node2_L.get_top(), buff=0.1, color=LIGHT_GREY)
        arrow1_R = Arrow(node1_R.get_bottom(), node2_R.get_top(), buff=0.1, color=LIGHT_GREY)

        arrow2_L = Arrow(node2_L.get_bottom(), node3.get_top() + LEFT*0.2, buff=0.1, color=LIGHT_GREY)
        arrow2_R = Arrow(node2_R.get_bottom(), node3.get_top() + RIGHT*0.2, buff=0.1, color=LIGHT_GREY)

        # ---------------- 애니메이션 시퀀스 ----------------
        self.play(FadeIn(node1_group, shift=DOWN))
        self.wait(1)

        # 수렴(Reduction)되는 느낌
        self.play(
            GrowArrow(arrow1_L), GrowArrow(arrow1_R),
            ReplacementTransform(node1_L.copy(), node2_L),
            ReplacementTransform(node1_R.copy(), node2_R),
        )
        self.play(FadeIn(node2_plus))
        self.wait(1)

        # 36과 100이 모여서 136으로 병합됨
        self.play(
            GrowArrow(arrow2_L), GrowArrow(arrow2_R),
            ReplacementTransform(VGroup(node2_L.copy(), node2_plus.copy(), node2_R.copy()), node3)
        )
        
        box = SurroundingRectangle(node3, color=PURPLE, buff=0.2)
        self.play(Create(box))
        self.wait(3)

        self.play(FadeOut(Group(*self.mobjects)))
