import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { EditorState, convertToRaw, ContentState } from 'draft-js'
import { Editor } from 'react-draft-wysiwyg'
import draftToHtml from 'draftjs-to-html'
import htmlToDraft from 'html-to-draftjs'

import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'


export default class RichTextEditor extends Component {

    state = {
        editorState: EditorState.createEmpty(),  //创建一个空的编辑器
    }

    static propTypes = {
        detail: PropTypes.string
    }

    constructor(props) {
        super(props)
        const html = this.props.detail  // 根据传入的商品详情决定显示富文本内容
        if (html) {  // 有则显示传入内容
            const contentBlock = htmlToDraft(html)
            if (contentBlock) {
                const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
                const editorState = EditorState.createWithContent(contentState)
                this.state = {
                    editorState,
                }
            }
        } else {  // 否则显示空
            this.state = {
                editorState: EditorState.createEmpty(),  //  创建一个空的编辑器
            }
        }
    }


    /* 
        输入过程实时回调
    */
    onEditorStateChange = (editorState) => {
        this.setState({
            editorState,
        })
    }

    /* 
        获取富文本输入的html格式文本
    */
    getDetail = () => {
        return draftToHtml(convertToRaw(this.state.editorState.getCurrentContent()))
    }

    /* 
        富文本图片上传
    */

    uploadImageCallBack = (file) => {
        return new Promise(
            (resolve, reject) => {
                const xhr = new XMLHttpRequest()
                xhr.open('POST', '/manage/img/upload')
                xhr.setRequestHeader('Authorization', 'Client-ID XXXXX')
                const data = new FormData()
                data.append('image', file)
                xhr.send(data)
                xhr.addEventListener('load', () => {
                    const response = JSON.parse(xhr.responseText)
                    const url = response.data.url
                    resolve({ data: { link: url } })
                })
                xhr.addEventListener('error', () => {
                    const error = JSON.parse(xhr.responseText)
                    reject(error)
                })
            }
        )
    }

    render() {
        const { editorState } = this.state
        return (
            <div>
                <Editor
                    editorState={editorState}
                    wrapperClassName="demo-wrapper"
                    editorClassName="demo-editor"
                    onEditorStateChange={this.onEditorStateChange}
                    editorStyle={{ border: '0.5px solid black', minHeight: 200, padding: '0 20px' }}
                    toolbar={{
                        image: { uploadCallback: this.uploadImageCallBack, alt: { present: true, mandatory: true } },
                    }}
                />

            </div>
        )
    }
}