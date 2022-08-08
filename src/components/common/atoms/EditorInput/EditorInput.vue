<template>
  <transition v-bind="attrs['transition-attrs']">
    <div id="EditorInput" v-bind="attrs['div-attrs']">
      <p v-if="label"><b>{{ label }}:</b></p>
      <q-editor :modelValue="modelValue ? modelValue : ''"
                @update:modelValue="$emit('update:modelValue', $event)"
                v-bind="attrs['attrs']"
                @keyup.enter.stop/>
    </div>
  </transition>
</template>

<script>
  export default {
    name: 'EditorInput',
    inheritAttrs: false,
    props: {
      modelValue: {
        type: String
      },
      path: {
        required: true
      },
      label: {
        type: String
      },
    },
    data() {
      return {};
    },
    computed: {
      attrs() {
        let newVal = {...this.$attrs};
        // attrs defaults
        this.$lset(newVal, 'attrs.ref', this.$lget(newVal, 'attrs.ref', 'editor'));
        this.$lset(newVal, 'attrs.max-height', this.$lget(newVal, 'attrs.max-height', '30rem'));
        this.$lset(newVal, 'attrs.autofocus', this.$lget(newVal, 'attrs.autofocus', true));
        this.$lset(newVal, 'attrs.toolbar-rounded', this.$lget(newVal, 'attrs.toolbar-rounded', true));
        this.$lset(newVal, 'attrs.toolbar', this.$lget(newVal, 'attrs.toolbar', [
          [
            {
              icon: this.$q.iconSet.editor.align,
              fixedLabel: true,
              options: ['left', 'center', 'right', 'justify']
            },
          ],
          ['bold', 'italic', 'strike', 'underline', 'subscript', 'superscript'],
          ['token', 'hr', 'link', 'custom_btn'],
          ['print', 'fullscreen'],
          ['insert_img', 'insert_video_url'],
          [
            {
              label: this.$q.lang.editor.formatting,
              icon: this.$q.iconSet.editor.formatting,
              list: 'no-icons',
              options: [
                'p',
                'h1',
                'h2',
                'h3',
                'h4',
                'h5',
                'h6',
                'code'
              ]
            },
            {
              label: this.$q.lang.editor.fontSize,
              icon: this.$q.iconSet.editor.fontSize,
              fixedLabel: true,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'size-1',
                'size-2',
                'size-3',
                'size-4',
                'size-5',
                'size-6',
                'size-7'
              ]
            },
            {
              label: this.$q.lang.editor.defaultFont,
              icon: this.$q.iconSet.editor.font,
              fixedIcon: true,
              list: 'no-icons',
              options: [
                'default_font',
                'arial',
                'arial_black',
                'comic_sans',
                'courier_new',
                'impact',
                'lucida_grande',
                'times_new_roman',
                'verdana'
              ]
            },
            'removeFormat'
          ],
          ['quote', 'unordered', 'ordered', 'outdent', 'indent'],
          ['undo', 'redo'],
          ['viewsource']
        ]));

        this.$lset(newVal, 'attrs.fonts', this.$lget(newVal, 'attrs.fonts', {
          arial: 'Arial',
          arial_black: 'Arial Black',
          comic_sans: 'Comic Sans MS',
          courier_new: 'Courier New',
          impact: 'Impact',
          lucida_grande: 'Lucida Grande',
          times_new_roman: 'Times New Roman',
          verdana: 'Verdana'
        }));

        this.$lset(newVal, 'attrs.definitions', this.$lget(newVal, 'attrs.definitions', {
          insert_img: {
            label: 'Image',
            tip: 'Insert Image',
            icon: 'insert_photo',
            handler: () => {
              // create an input file element to open file dialog
              const input = document.createElement('input');
              input.type = 'file';
              input.accept = '.png, .jpg'; // file extensions allowed
              let file;
              // eslint-disable-next-line no-unused-vars
              input.onchange = _ => {
                const files = Array.from(input.files);
                file = files[0];

                // lets load the file as dataUrl
                const reader = new FileReader();
                let dataUrl = '';
                reader.onloadend = function () {
                  dataUrl = reader.result;

                  // append result to the body of your post
                  // post.body += '<div><img src="' + dataUrl + '" /></div>';
                  document.execCommand('insertHTML', true, '<img src="' + dataUrl + '" />');
                };
                reader.readAsDataURL(file);
              };
              input.click();
            } // handler will call insertImg() method
          },
          insert_video_url: {
            label: 'Video',
            tip: 'Insert Video',
            icon: 'video_call',
            handler: () => {
              console.log('$refs', this.$refs);
              // eslint-disable-next-line no-unused-vars
              this.currentEditor = this.$refs.editor[0];
              this.dioVideo = !this.dioVideo;
            }
          },
        }));

        // div-attrs defaults
        this.$lset(newVal, 'div-attrs.class', this.$lget(newVal, 'div-attrs.class', 'col-12'));
        return newVal;
      },
    },
  };
</script>

<style scoped lang="scss" src="./_EditorInput.scss">
</style>
