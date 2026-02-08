-- Change competencies from soft skills to high school subjects
ALTER TABLE public.competencies RENAME COLUMN comunicacao TO matematica;
ALTER TABLE public.competencies RENAME COLUMN pensamento_critico TO portugues;
ALTER TABLE public.competencies RENAME COLUMN resolucao_problemas TO historia;
ALTER TABLE public.competencies RENAME COLUMN colaboracao TO geografia;
ALTER TABLE public.competencies RENAME COLUMN criatividade TO fisica;
ALTER TABLE public.competencies RENAME COLUMN gestao_tempo TO quimica;
