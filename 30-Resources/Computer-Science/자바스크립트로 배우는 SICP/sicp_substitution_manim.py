from manim import *

class SICPSubstitution(Scene):
    def construct(self):
        # 폰트는 환경에 맞게 변경 가능합니다 (macOS의 경우 AppleGothic 등 기본 한글 폰트)
        title = Text("함수 적용의 치환 모형", font="AppleGothic", font_size=40)
        title.to_edge(UP, buff=1)
        self.play(FadeIn(title, shift=UP))
        self.wait(0.5)

        # 현재 상태 표시 (전개 vs 축약)
        status_text = Text("전개 (Expansion)", font="AppleGothic", color=BLUE, font_size=30)
        status_text.next_to(title, DOWN, buff=0.5)
        self.play(Write(status_text))
        self.wait(1)

        # 1. 전개 (Expansion) 단계
        eq_f = MathTex("f(5)", font_size=48)
        eq_sum_sq = MathTex(r"sum\_of\_squares(5 + 1, 5 \times 2)", font_size=48)
        eq_sq_plus_sq = MathTex(r"square(5 + 1) + square(5 \times 2)", font_size=48)
        eq_expanded = MathTex(r"(5 + 1) \times (5 + 1) + (5 \times 2) \times (5 \times 2)", font_size=48)

        self.play(Write(eq_f))
        self.wait(1.5)
        
        self.play(ReplacementTransform(eq_f, eq_sum_sq))
        self.wait(1.5)
        
        self.play(ReplacementTransform(eq_sum_sq, eq_sq_plus_sq))
        self.wait(1.5)
        
        self.play(ReplacementTransform(eq_sq_plus_sq, eq_expanded))
        self.wait(2)

        # 2. 상태를 축약으로 변경
        status_red = Text("축약 (Reduction)", font="AppleGothic", color=GREEN, font_size=30)
        status_red.move_to(status_text)
        self.play(ReplacementTransform(status_text, status_red))
        self.wait(1)

        # 3. 축약 (Reduction) 단계
        eq_calc_1 = MathTex(r"6 \times 6 + 10 \times 10", font_size=48)
        eq_calc_2 = MathTex(r"36 + 100", font_size=48)
        eq_final = MathTex(r"136", font_size=60, color=YELLOW)

        self.play(ReplacementTransform(eq_expanded, eq_calc_1))
        self.wait(1.5)

        self.play(ReplacementTransform(eq_calc_1, eq_calc_2))
        self.wait(1.5)

        self.play(ReplacementTransform(eq_calc_2, eq_final))
        self.wait(1)

        # 최종 박스 강조
        box = SurroundingRectangle(eq_final, color=YELLOW, buff=0.2)
        self.play(Create(box))
        self.wait(3)

        self.play(FadeOut(Group(*self.mobjects)))
