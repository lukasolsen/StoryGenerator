import gpt_2_simple as gpt2
import os


class AI:
    def __init__(self, model_name="124M"):
        self.model_name = model_name
        self.sess = None

    def _load_ai(self):
        if self.sess is None:
            self.sess = gpt2.start_tf_sess()

        if not os.path.isdir(os.path.join("models", self.model_name)):
            print(f"Downloading {self.model_name} model...")
            gpt2.download_gpt2(model_name=self.model_name)

        gpt2.load_gpt2(self.sess, model_name=self.model_name)

    def generate_story(self, prompt="Hello World", length=100, temperature=0.7, top_k=0, top_p=0.0, truncate=None, include_prefix=True):
        self._load_ai()  # Ensure the AI is properly loaded

        if prompt is None or len(prompt) == 0:
            raise Exception("Prompt cannot be empty.")

        generated_text = gpt2.generate(self.sess, model_name=self.model_name, prefix=prompt, length=length, temperature=temperature,
                                       top_k=top_k, top_p=top_p, truncate=truncate, include_prefix=include_prefix, return_as_list=True)[0]
        return generated_text

    def close(self):
        if self.sess is not None:
            gpt2.reset_session(sess=self.sess)
            self.sess.close()
