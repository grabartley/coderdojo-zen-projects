<template>
  <div class="acknowledgements">
    <div class="acknowledgements__banner">
      <div class="acknowledgements__banner-title">Acknowledgements</div>
      <div class="acknowledgements__banner-subtitle">Packages/tools used in this project which require that they be referenced</div>
    </div>
    <div class="acknowledgements__list">
      <ul>
        <li class="acknowledgements__list-item"><a href="https://www.npmjs.com/package/http" target="_blank">http package</a></li>
        Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
        Copyright (c) 2014 yuanyan. All rights reserved.
        THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
        <li class="acknowledgements__list-item"><a href="https://www.npmjs.com/package/file-system" target="_blank">file-system package</a></li>
        Copyright (c) 2004-2010 by Internet Systems Consortium, Inc. ("ISC") 
        Copyright (c) 1995-2003 by Internet Software Consortium
        Permission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies.
        THE SOFTWARE IS PROVIDED "AS IS" AND ISC DISCLAIMS ALL WARRANTIES WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL ISC BE LIABLE FOR ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
        <li class="acknowledgements__list-item"><a href="https://github.com/vuejs-templates/webpack">webpack boilerplate used</a></li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Acknowledgements',
}
</script>

<style scoped lang="less">
  .acknowledgements {
    &__banner {
      padding: 25px 20px;
      color: white;
      background-color: #73449B;
      &-title {
        font-size: 30px;
      }
      &-subtitle {
        margin-top: 4px;
        font-size: 20px;
      }
    }
    &__list {
      text-align: left;
      &-item {
        margin: 16px 0;
      }
    }
  }
</style>